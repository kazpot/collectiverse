import { ethers } from "hardhat";
import { OrderStruct, SigStruct } from "../types/Exchange";

const sigPrefix = "\x19Ethereum Signed Message:\n32";

export const Side = {
  Buy: 0,
  Sell: 1,
};

export const emptySig: SigStruct = {
  v: 0,
  r: "0x0000000000000000000000000000000000000000000000000000000000000000",
  s: "0x0000000000000000000000000000000000000000000000000000000000000000",
};

export const computeHashOrderWithPrefix = (order: OrderStruct): string => {
  const side: string = order.side == Side.Sell ? "sell" : "buy";
  const payload = ethers.utils.solidityKeccak256(
    [
      "address",
      "address",
      "address",
      "string",
      "address",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "address",
      "address",
    ],
    [
      order.exchange,
      order.maker,
      order.taker,
      side,
      order.nftAddress,
      order.tokenId,
      order.basePrice,
      order.listingTime,
      order.expirationTime,
      order.paymentToken,
      order.royaltyRecipient,
    ]
  );
  return ethers.utils.solidityKeccak256(
    ["string", "bytes"],
    [sigPrefix, payload]
  );
};

export const computeHashOrder = (order: OrderStruct): string => {
  const side: string = order.side == Side.Sell ? "sell" : "buy";
  return ethers.utils.solidityKeccak256(
    [
      "address",
      "address",
      "address",
      "string",
      "address",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "address",
      "address",
    ],
    [
      order.exchange,
      order.maker,
      order.taker,
      side,
      order.nftAddress,
      order.tokenId,
      order.basePrice,
      order.listingTime,
      order.expirationTime,
      order.paymentToken,
      order.royaltyRecipient,
    ]
  );
};
