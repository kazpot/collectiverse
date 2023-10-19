// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract ExchangeProxyImpl is Initializable {
    // user address
    address private _user;

    // proxy resgistry address
    address private _registry;

    // whether access has been revoked
    bool private _revoked;

    event Revoked(bool revoked);

    /**
     * @dev Initialize AuthenticatedProxy only once
     * @param userAddr Address of user
     * @param registryAddr Address of ProxyRegistry contract
     */
    function initialize(address userAddr, address registryAddr)
        public
        initializer
    {
        _user = userAddr;
        _registry = registryAddr;
    }

    function setRevoke(bool revoke) public {
        require(msg.sender == _user);
        _revoked = revoke;
        emit Revoked(revoke);
    }

    function invoke(
        address dest,
        address from,
        address to,
        uint256 tokenId
    ) public returns (bool result) {
        require(!_revoked);
        require(msg.sender == _user);
        (result, ) = dest.call(
            abi.encodeWithSignature(
                "safeTransferFrom(address,address,uint256)",
                from,
                to,
                tokenId
            )
        );
        return result;
    }
}
