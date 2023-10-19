// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockWETH is ERC20 {
    string public constant NAME = "Fake WETH";
    string public constant SYMBOL = "WETH";
    uint8 public constant DECIMALS = 18;
    uint256 public constant INITIAL_SUPPLY =
        100000000 * (10**uint256(DECIMALS));

    constructor() ERC20(NAME, SYMBOL) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
