import { Sig } from './types';

export const zeroAddress = '0x0000000000000000000000000000000000000000';

export const auctionTypes = [
  {
    value: 'true',
    label: 'Yes',
  },
  {
    value: 'false',
    label: 'No',
  },
];

export const emptySig: Sig = {
  v: 0,
  r: '0x0000000000000000000000000000000000000000000000000000000000000000',
  s: '0x0000000000000000000000000000000000000000000000000000000000000000',
};

export const chains: {
  [char: number]: { chainName: string; nativeSymbol: string; auctionSymbol: string };
} = {
  // Mainnet
  1: {
    chainName: 'ETHEREUM',
    nativeSymbol: 'ETH',
    auctionSymbol: 'ETH',
  },
  // Goerli
  5: {
    chainName: 'GOERLI',
    nativeSymbol: 'ETH',
    auctionSymbol: 'ETH',
  },
  // Polygon
  137: {
    chainName: 'POLYGON',
    nativeSymbol: 'MATIC',
    auctionSymbol: 'MATIC',
  },
  // Mumbai
  80001: {
    chainName: 'MUMBAI',
    nativeSymbol: 'MATIC',
    auctionSymbol: 'MATIC',
  },
  // Topos
  2359: {
    chainName: 'TOPOS',
    nativeSymbol: 'TOPOS',
    auctionSymbol: 'TOPOS',
  },
  // Private chain
  1337: {
    chainName: 'LOCAL',
    nativeSymbol: 'ETH',
    auctionSymbol: 'ETH',
  },
  // Arbitrum
  42161: {
    chainName: 'ARBITRUM',
    nativeSymbol: 'ETH',
    auctionSymbol: 'ETH',
  },
};
