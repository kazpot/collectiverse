// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import {Util} from "./Util.sol";

contract TestUtil {
    function testBytes32ToString(bytes32 message)
        public
        pure
        returns (string memory)
    {
        return Util.bytes32ToString(message);
    }
}
