import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { Order, Side, Sig } from './types';

export const getCurrentUser = async (): Promise<ethers.providers.JsonRpcSigner> => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  return signer;
};

export const getCurrentNetwork = async (): Promise<ethers.providers.Network> => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const network = provider.getNetwork();
  return network;
};

export const computeHashOrder = (order: Order): string => {
  const side: string = order.side.toNumber() == Side.Sell ? 'sell' : 'buy';
  return ethers.utils.solidityKeccak256(
    [
      'address',
      'address',
      'address',
      'string',
      'address',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'address',
      'address',
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
    ],
  );
};

export const signOrder = async (order: Order): Promise<Sig> => {
  const currentUser = await getCurrentUser();
  const orderHash = computeHashOrder(order);
  const sig = await currentUser.signMessage(ethers.utils.arrayify(orderHash));
  const expanded = ethers.utils.splitSignature(sig);
  return {
    v: expanded.v,
    r: expanded.r,
    s: expanded.s,
  };
};

export const shortAddress = (address: string, chainSymbol: string): string => {
  if (!address || address.length !== 42) {
    return `${chainSymbol}: No Address`;
  }
  return (
    `${chainSymbol}: ` + address.substring(0, 6) + '...' + address.substring(address.length - 4)
  );
};

export const shortAddressOnly = (address: string): string => {
  if (!address || address.length !== 42) {
    return `Invalid Address`;
  }
  return address.substring(0, 6) + '...' + address.substring(address.length - 4);
};

export const renderUnixTime = (unixTime: string): string => {
  const currentTimestamp = new Date(parseInt(unixTime) * 1000);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(currentTimestamp);
};

export const listId = (listingTime: string, maker: string): string => {
  return `${maker}:::${parseInt(listingTime).toString()}`;
};

export const splitIntoChunks = (arr: any[], chunkSize: number): any[] => {
  let newArr = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    newArr.push(chunk);
  }
  return newArr;
};
