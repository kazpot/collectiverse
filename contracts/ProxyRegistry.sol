// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ExchangeProxy.sol";

contract ProxyRegistry is Ownable {
    // manage exchange's proxy
    mapping(address => ExchangeProxy) public proxies;

    // approve contract address that calls this contract
    mapping(address => bool) public contracts;

    // pending for approving contract address that calls this contract
    mapping(address => uint256) public pending;

    /**
     * @dev Begin authenticating contract
     * @param contractAddr contract address that calls this contract
     */
    function beginGrantAuth(address contractAddr) external onlyOwner {
        require(!contracts[contractAddr] && pending[contractAddr] == 0);
        pending[contractAddr] = 1;
    }

    /**
     * @dev Finish authenticating contract
     * @param contractAddr contract address that calls this contract
     */
    function finishGrantAuth(address contractAddr) external onlyOwner {
        require(!contracts[contractAddr] && pending[contractAddr] != 0);
        pending[contractAddr] = 0;
        contracts[contractAddr] = true;
    }

    /**
     * @dev Revoke authentication for contract address and prevent proxy registration
     * @param contractAddr contract address that calls this contract
     */
    function revokeAuth(address contractAddr) public onlyOwner {
        contracts[contractAddr] = false;
    }

    /**
     * @dev register proxy for exchange contract and initialize implementation part
     */
    function registerProxy() public returns (bool) {
        require(contracts[msg.sender]);
        require(address(proxies[msg.sender]) == address(0));
        ExchangeProxy proxy = new ExchangeProxy(
            msg.sender,
            abi.encodeWithSignature(
                "initialize(address,address)",
                msg.sender,
                address(this)
            )
        );
        proxies[msg.sender] = proxy;
        return true;
    }

    function setNewProxyImpl(address newImpl) public {
        require(contracts[msg.sender]);
        ExchangeProxy proxy = proxies[msg.sender];
        proxy.upgradeTo(
            newImpl,
            abi.encodeWithSignature(
                "initialize(address,address)",
                msg.sender,
                address(this)
            )
        );
    }
}
