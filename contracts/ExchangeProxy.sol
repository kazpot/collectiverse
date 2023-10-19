// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./UpgradableProxy.sol";
import "./ExchangeProxyImpl.sol";

contract ExchangeProxy is UpgradableProxy {
    constructor(address owner, bytes memory data) {
        ExchangeProxyImpl proxyImpl = new ExchangeProxyImpl();
        _setProxyOwner(owner);
        _upgradeTo(address(proxyImpl));
        (bool success, ) = address(proxyImpl).call(data);
        require(success);
    }
}
