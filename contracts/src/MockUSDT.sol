// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDT
 * @notice Test token with 6 decimals (matches real USDT).
 *         Mint freely for local/testnet testing.
 */
contract MockUSDT is ERC20 {
    constructor() ERC20("Mock USD Tether", "USDT") {
        // Mint 10M USDT to deployer for testing
        _mint(msg.sender, 10_000_000 * 10 ** 6);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /// @notice Anyone can mint on testnet — remove for mainnet
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
