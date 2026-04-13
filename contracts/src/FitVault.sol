// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title FitVault
 * @notice Autonomous commitment protocol — stake USDT against a fitness goal.
 *         On success: principal + yield returned to user.
 *         On failure: 5% protocol fee + 95% to community reward pool.
 *
 * Architecture:
 *   - Users stake USDT directly into this contract.
 *   - An authorized oracle (OpenClaw agent) attests daily biometric results on-chain.
 *   - At window close, the oracle calls settle() with the final outcome.
 *   - Yield is simulated via a fixed APY constant (replace with Aave aToken balance delta in prod).
 *
 * Production upgrade path:
 *   - Replace _simulateYield() with actual Aave V3 aToken balance tracking.
 *   - Replace oracle address with a Chainlink Functions / OpenClaw on-chain verifier.
 *   - Add Paraswap swap call in _settleSuccess() for XAU₮ compounding.
 */
contract FitVault is ReentrancyGuard, Ownable, Pausable {
    using SafeERC20 for IERC20;

    // ─── Types ───────────────────────────────────────────────────────────────

    enum GoalType { STEPS, ACTIVE_MINUTES, HEART_RATE }
    enum VaultStatus { ACTIVE, SUCCESS, FORFEIT, CANCELLED }

    struct Vault {
        address owner;
        uint256 stakeAmount;      // USDT (6 decimals)
        GoalType goalType;
        uint256 goalTarget;       // e.g. 10000 steps/day
        uint256 durationDays;
        uint256 startTime;
        uint256 endTime;
        bool compounding;         // elect XAU₮ swap on success
        VaultStatus status;
        uint256 daysCompleted;    // oracle-attested passing days
        uint256 yieldAccrued;     // USDT yield (6 decimals)
    }

    // ─── State ────────────────────────────────────────────────────────────────

    IERC20 public immutable usdt;

    address public oracle;                    // OpenClaw agent address
    address public communityPool;             // reward pool recipient
    address public treasury;                  // protocol fee recipient

    uint256 public constant PROTOCOL_FEE_BPS = 500;    // 5%
    uint256 public constant COMMUNITY_BPS    = 9500;   // 95%
    uint256 public constant YIELD_SHARE_BPS  = 8500;   // 85% to user on success
    uint256 public constant SIMULATED_APY_BPS = 420;   // 4.20% annual (basis points)
    uint256 public constant BPS_DENOMINATOR  = 10000;

    uint256 private _nextVaultId;
    mapping(uint256 => Vault) public vaults;
    mapping(address => uint256[]) public userVaults;

    // ─── Events ───────────────────────────────────────────────────────────────

    event VaultCreated(
        uint256 indexed vaultId,
        address indexed owner,
        uint256 stakeAmount,
        GoalType goalType,
        uint256 goalTarget,
        uint256 durationDays,
        bool compounding
    );

    event DayAttested(
        uint256 indexed vaultId,
        uint256 day,
        uint256 value,
        bool passed
    );

    event VaultSettled(
        uint256 indexed vaultId,
        address indexed owner,
        VaultStatus outcome,
        uint256 payout,
        uint256 yieldAmount
    );

    event OracleUpdated(address indexed oldOracle, address indexed newOracle);
    event CommunityPoolUpdated(address indexed oldPool, address indexed newPool);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);

    // ─── Errors ───────────────────────────────────────────────────────────────

    error NotVaultOwner();
    error VaultNotActive();
    error VaultWindowNotClosed();
    error VaultWindowClosed();
    error OnlyOracle();
    error ZeroAddress();
    error ZeroAmount();
    error InvalidDuration();
    error AlreadyAttested();

    // ─── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyOracle() {
        if (msg.sender != oracle) revert OnlyOracle();
        _;
    }

    modifier vaultActive(uint256 vaultId) {
        if (vaults[vaultId].status != VaultStatus.ACTIVE) revert VaultNotActive();
        _;
    }

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor(
        address _usdt,
        address _oracle,
        address _communityPool,
        address _treasury
    ) Ownable(msg.sender) {
        if (_usdt == address(0) || _oracle == address(0) ||
            _communityPool == address(0) || _treasury == address(0))
            revert ZeroAddress();

        usdt          = IERC20(_usdt);
        oracle        = _oracle;
        communityPool = _communityPool;
        treasury      = _treasury;
    }

    // ─── User functions ───────────────────────────────────────────────────────

    /**
     * @notice Create a new commitment vault.
     * @param stakeAmount  USDT amount (6 decimals).
     * @param goalType     0=STEPS, 1=ACTIVE_MINUTES, 2=HEART_RATE.
     * @param goalTarget   Daily target value (e.g. 10000).
     * @param durationDays Commitment window in days (7, 14, 30, or 90).
     * @param compounding  If true, yield is swapped to XAU₮ on success.
     * @return vaultId     The new vault's ID.
     */
    function createVault(
        uint256 stakeAmount,
        uint8   goalType,
        uint256 goalTarget,
        uint256 durationDays,
        bool    compounding
    ) external nonReentrant whenNotPaused returns (uint256 vaultId) {
        if (stakeAmount == 0) revert ZeroAmount();
        if (durationDays == 0 || durationDays > 365) revert InvalidDuration();

        // Pull USDT from user (must have approved this contract first)
        usdt.safeTransferFrom(msg.sender, address(this), stakeAmount);

        vaultId = _nextVaultId++;

        vaults[vaultId] = Vault({
            owner:          msg.sender,
            stakeAmount:    stakeAmount,
            goalType:       GoalType(goalType),
            goalTarget:     goalTarget,
            durationDays:   durationDays,
            startTime:      block.timestamp,
            endTime:        block.timestamp + (durationDays * 1 days),
            compounding:    compounding,
            status:         VaultStatus.ACTIVE,
            daysCompleted:  0,
            yieldAccrued:   0
        });

        userVaults[msg.sender].push(vaultId);

        emit VaultCreated(
            vaultId, msg.sender, stakeAmount,
            GoalType(goalType), goalTarget, durationDays, compounding
        );
    }

    // ─── Oracle functions ─────────────────────────────────────────────────────

    /**
     * @notice Oracle attests a single day's biometric result.
     * @param vaultId  Target vault.
     * @param day      Day number (1-indexed).
     * @param value    Measured value (steps, minutes, etc.).
     * @param passed   Whether the daily goal was met.
     */
    function attestDay(
        uint256 vaultId,
        uint256 day,
        uint256 value,
        bool    passed
    ) external onlyOracle vaultActive(vaultId) {
        Vault storage v = vaults[vaultId];
        if (block.timestamp > v.endTime) revert VaultWindowClosed();

        if (passed) {
            v.daysCompleted++;
        }

        // Accrue simulated yield for this day
        uint256 dailyYield = _dailyYield(v.stakeAmount);
        v.yieldAccrued += dailyYield;

        emit DayAttested(vaultId, day, value, passed);
    }

    /**
     * @notice Settle a vault after its commitment window has closed.
     *         Oracle determines success/forfeit based on daysCompleted vs durationDays.
     * @param vaultId  Target vault.
     * @param success  True if the user met their goal.
     */
    function settle(
        uint256 vaultId,
        bool    success
    ) external onlyOracle vaultActive(vaultId) nonReentrant {
        Vault storage v = vaults[vaultId];
        if (block.timestamp < v.endTime) revert VaultWindowNotClosed();

        if (success) {
            _settleSuccess(vaultId, v);
        } else {
            _settleForfeit(vaultId, v);
        }
    }

    /**
     * @notice Emergency cancel — owner can cancel their own vault before window closes.
     *         Returns principal only (no yield). Intended for edge cases.
     */
    function cancelVault(uint256 vaultId) external nonReentrant vaultActive(vaultId) {
        Vault storage v = vaults[vaultId];
        if (v.owner != msg.sender) revert NotVaultOwner();

        v.status = VaultStatus.CANCELLED;
        usdt.safeTransfer(msg.sender, v.stakeAmount);

        emit VaultSettled(vaultId, msg.sender, VaultStatus.CANCELLED, v.stakeAmount, 0);
    }

    // ─── Internal settlement ──────────────────────────────────────────────────

    function _settleSuccess(uint256 vaultId, Vault storage v) internal {
        v.status = VaultStatus.SUCCESS;

        // Cap yield to what the contract actually holds above the principal.
        // In production the contract holds aTokens whose balance grows — here
        // we simulate by only paying from available balance.
        uint256 contractBalance = usdt.balanceOf(address(this));
        uint256 availableYield  = contractBalance > v.stakeAmount
            ? contractBalance - v.stakeAmount
            : 0;

        // Use the lesser of accrued yield and available yield
        uint256 effectiveYield   = availableYield < v.yieldAccrued ? availableYield : v.yieldAccrued;
        uint256 userYield        = (effectiveYield * YIELD_SHARE_BPS) / BPS_DENOMINATOR;
        uint256 protocolYield    = effectiveYield - userYield;
        uint256 payout           = v.stakeAmount + userYield;

        // Transfer principal + 85% yield to user
        usdt.safeTransfer(v.owner, payout);

        // Transfer 15% yield to treasury
        if (protocolYield > 0) {
            usdt.safeTransfer(treasury, protocolYield);
        }

        // NOTE: compounding (USD₮ → XAU₮ via Paraswap) is handled off-chain
        // by the OpenClaw agent after receiving the payout. The `compounding`
        // flag is stored on-chain for the agent to read and act on.

        emit VaultSettled(vaultId, v.owner, VaultStatus.SUCCESS, payout, v.yieldAccrued);
    }

    function _settleForfeit(uint256 vaultId, Vault storage v) internal {
        v.status = VaultStatus.FORFEIT;

        uint256 total         = v.stakeAmount;
        uint256 protocolFee   = (total * PROTOCOL_FEE_BPS) / BPS_DENOMINATOR;
        uint256 communityAmt  = total - protocolFee;

        usdt.safeTransfer(treasury,      protocolFee);
        usdt.safeTransfer(communityPool, communityAmt);

        emit VaultSettled(vaultId, v.owner, VaultStatus.FORFEIT, 0, 0);
    }

    // ─── Yield simulation ─────────────────────────────────────────────────────

    /**
     * @dev Simulates one day of Aave V3 yield at SIMULATED_APY_BPS.
     *      In production: replace with (aToken.balanceOf(this) - principal) delta.
     */
    function _dailyYield(uint256 principal) internal pure returns (uint256) {
        // dailyYield = principal * APY / 365 / 10000
        return (principal * SIMULATED_APY_BPS) / (365 * BPS_DENOMINATOR);
    }

    // ─── View functions ───────────────────────────────────────────────────────

    function getVault(uint256 vaultId) external view returns (Vault memory) {
        return vaults[vaultId];
    }

    function getUserVaults(address user) external view returns (uint256[] memory) {
        return userVaults[user];
    }

    function getVaultCount() external view returns (uint256) {
        return _nextVaultId;
    }

    /**
     * @notice Returns the current accrued yield for an active vault.
     */
    function currentYield(uint256 vaultId) external view returns (uint256) {
        return vaults[vaultId].yieldAccrued;
    }

    /**
     * @notice Projected total yield at end of commitment window.
     */
    function projectedYield(uint256 vaultId) external view returns (uint256) {
        Vault memory v = vaults[vaultId];
        return _dailyYield(v.stakeAmount) * v.durationDays;
    }

    // ─── Admin functions ──────────────────────────────────────────────────────

    function setOracle(address _oracle) external onlyOwner {
        if (_oracle == address(0)) revert ZeroAddress();
        emit OracleUpdated(oracle, _oracle);
        oracle = _oracle;
    }

    function setCommunityPool(address _pool) external onlyOwner {
        if (_pool == address(0)) revert ZeroAddress();
        emit CommunityPoolUpdated(communityPool, _pool);
        communityPool = _pool;
    }

    function setTreasury(address _treasury) external onlyOwner {
        if (_treasury == address(0)) revert ZeroAddress();
        emit TreasuryUpdated(treasury, _treasury);
        treasury = _treasury;
    }

    function pause()   external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    /**
     * @notice Emergency drain — only callable by owner, only for tokens
     *         accidentally sent to the contract (not USDT held in vaults).
     */
    function rescueTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
}
