// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CommissionFeeRecipent is ReentrancyGuard, Ownable {
    event ReceivedNative(address indexed sender, uint256 amount);

    function totalNativeBalance() public view returns (uint256) {
        return payable(address(this)).balance;
    }

    function totalTokenBalance(address token) public view returns (uint256) {
        return ERC20(token).balanceOf(address(this));
    }

    function withdrawNative(uint256 amount) external nonReentrant onlyOwner {
        require(amount <= totalNativeBalance());
        payable(msg.sender).transfer(amount);
    }

    function withdrawToken(address token, uint256 amount)
        external
        nonReentrant
        onlyOwner
    {
        require(amount <= totalTokenBalance(token));
        require(ERC20(token).transferFrom(address(this), msg.sender, amount));
    }

    receive() external payable {
        emit ReceivedNative(msg.sender, msg.value);
    }

    fallback() external payable {
        emit ReceivedNative(msg.sender, msg.value);
    }
}
