// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/proxy/Proxy.sol";

contract UpgradableProxy is Proxy {
    address internal _impl;
    address private _owner;

    event ProxyOwnershipTransferred(address previousOwner, address newOwner);
    event Upgraded(address indexed implementation);

    modifier onlyProxyOwner() {
        require(msg.sender == _owner);
        _;
    }

    function _setProxyOwner(address newOwner) internal {
        _owner = newOwner;
    }

    function _implementation() internal view override returns (address) {
        return _impl;
    }

    function getImpl() public view returns (address) {
        return _impl;
    }

    function _upgradeTo(address newImpl) internal {
        require(_impl != newImpl);
        _impl = newImpl;
        emit Upgraded(address(newImpl));
    }

    function proxyOwner() public view returns (address) {
        return _owner;
    }

    function transferProxyOwnership(address newOwner) public onlyProxyOwner {
        require(newOwner != address(0));
        emit ProxyOwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    function upgradeTo(address newImpl, bytes memory data)
        public
        onlyProxyOwner
    {
        _upgradeTo(newImpl);
        (bool success, ) = address(newImpl).call(data);
        require(success);
    }
}
