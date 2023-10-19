// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

library Util {
    /**
     * @dev convert 32-byte data to hex string
     * @param _bytes32 32-byte data
     */
    function bytes32ToString(bytes32 _bytes32)
        public
        pure
        returns (string memory)
    {
        uint8 i = 0;
        bytes memory bytesArray = new bytes(64);
        for (i = 0; i < bytesArray.length; i++) {
            uint8 _first4 = uint8(_bytes32[i / 2] >> 4);
            uint8 _last4 = uint8(_bytes32[i / 2] & 0x0f);
            bytesArray[i] = toChar(_first4);
            i = i + 1;
            bytesArray[i] = toChar(_last4);
        }
        return string(bytesArray);
    }

    /**
     * @dev convert uint8 to character byte
     * @param _uint8 4-byte data (1 - 15 to be expected as arg)
     */
    function toChar(uint8 _uint8) private pure returns (bytes1) {
        if (_uint8 < 10) {
            // 1 - 9 => 0( ASCII 48) - 9(ASCII 57)
            return bytes1(_uint8 + 48);
        } else {
            // 10 -> a(ASCII 97), 11 -> b(ASCII 98), ..., 15 -> f(ASCII 102)
            return bytes1(_uint8 + 87);
        }
    }

    function addressToString(address _addr)
        public
        pure
        returns (string memory)
    {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(51);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint256(uint8(value[i + 12] >> 4))];
            str[3 + i * 2] = alphabet[uint256(uint8(value[i + 12] & 0x0f))];
        }
        return string(str);
    }
}
