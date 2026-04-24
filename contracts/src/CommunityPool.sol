// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CommunityPool
 * @notice Receives forfeited USDT from FitVault and distributes it to
 *         top performers on the leaderboard at each epoch close.
 *
 * Distribution model:
 *   - Epoch = 7 days (configurable).
 *   - At epoch close, owner (or oracle) calls distributeEpoch() with
 *     a list of winners and their share weights.
 *   - Winners claim their USDT via claim().
 */
contract CommunityPool is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdt;

    uint256 public epochDuration = 7 days;
    uint256 public currentEpoch;
    uint256 public epochStartTime;

    // epoch => total received
    mapping(uint256 => uint256) public epochBalance;
    // epoch => user => claimable amount
    mapping(uint256 => mapping(address => uint256)) public claimable;
    // user => total claimed all time
    mapping(address => uint256) public totalClaimed;

    uint256 public totalReceived;
    uint256 public totalDistributed;

    event ForfeitReceived(uint256 indexed epoch, uint256 amount);
    event EpochDistributed(uint256 indexed epoch, address[] winners, uint256[] amounts);
    event Claimed(address indexed user, uint256 indexed epoch, uint256 amount);

    error NoClaimable();
    error ArrayLengthMismatch();
    error DistributionExceedsBalance();

    constructor(address _usdt) Ownable(msg.sender) {
        usdt = IERC20(_usdt);
        epochStartTime = block.timestamp;
    }

    /**
     * @notice Called by FitVault when a forfeit is routed here.
     *         Anyone can call — just tracks the incoming balance.
     */
    function receiveForfeit(uint256 amount) external {
        // amount already transferred by FitVault via safeTransfer
        epochBalance[currentEpoch] += amount;
        totalReceived += amount;
        emit ForfeitReceived(currentEpoch, amount);
    }
    /**
     * @notice Distribute current epoch's balance to winners.
     * @param winners  Array of winner addresses.
     * @param weights  Relative weights (will be normalised to sum).
     */
    function distributeEpoch(
        address[] calldata winners,
        uint256[] calldata weights
    ) external onlyOwner {
        if (winners.length != weights.length) revert ArrayLengthMismatch();

        uint256 balance = epochBalance[currentEpoch];
        uint256 totalWeight;
        for (uint256 i; i < weights.length; i++) totalWeight += weights[i];

        uint256 distributed;
        for (uint256 i; i < winners.length; i++) {
            uint256 share = (balance * weights[i]) / totalWeight;
            claimable[currentEpoch][winners[i]] += share;
            distributed += share;
        }

        if (distributed > balance) revert DistributionExceedsBalance();

        totalDistributed += distributed;

        emit EpochDistributed(currentEpoch, winners, _computeAmounts(balance, weights, totalWeight));

        // Advance epoch
        currentEpoch++;
        epochStartTime = block.timestamp;
    }

    /**
     * @notice Claim all pending rewards across all epochs.
     */
    function claim() external nonReentrant {
        uint256 total;
        for (uint256 e; e < currentEpoch; e++) {
            uint256 amt = claimable[e][msg.sender];
            if (amt > 0) {
                claimable[e][msg.sender] = 0;
                total += amt;
            }
        }
        if (total == 0) revert NoClaimable();

        totalClaimed[msg.sender] += total;
        usdt.safeTransfer(msg.sender, total);

        emit Claimed(msg.sender, currentEpoch - 1, total);
    }

    /**
     * @notice Claim rewards for a specific epoch.
     */
    function claimEpoch(uint256 epoch) external nonReentrant {
        uint256 amt = claimable[epoch][msg.sender];
        if (amt == 0) revert NoClaimable();
        claimable[epoch][msg.sender] = 0;
        totalClaimed[msg.sender] += amt;
        usdt.safeTransfer(msg.sender, amt);
        emit Claimed(msg.sender, epoch, amt);
    }

    function pendingRewards(address user) external view returns (uint256 total) {
        for (uint256 e; e < currentEpoch; e++) {
            total += claimable[e][user];
        }
    }

    function poolBalance() external view returns (uint256) {
        return usdt.balanceOf(address(this));
    }

    // ─── Internal ─────────────────────────────────────────────────────────────

    function _computeAmounts(
        uint256 balance,
        uint256[] calldata weights,
        uint256 totalWeight
    ) internal pure returns (uint256[] memory amounts) {
        amounts = new uint256[](weights.length);
        for (uint256 i; i < weights.length; i++) {
            amounts[i] = (balance * weights[i]) / totalWeight;
        }
    }
}
