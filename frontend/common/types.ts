import { BigNumber } from 'ethers';

export enum Side {
  // eslint-disable-next-line no-unused-vars
  Buy,
  // eslint-disable-next-line no-unused-vars
  Sell,
}

export enum ModalType {
  // eslint-disable-next-line no-unused-vars
  Price,
  // eslint-disable-next-line no-unused-vars
  List,
  // eslint-disable-next-line no-unused-vars
  Accept,
  // eslint-disable-next-line no-unused-vars
  MintAndList,
  // eslint-disable-next-line no-unused-vars
  YesOrNo,
}

export enum ListStatus {
  // eslint-disable-next-line no-unused-vars
  Listing = 'Listing',
  // eslint-disable-next-line no-unused-vars
  Canceled = 'Canceled',
  // eslint-disable-next-line no-unused-vars
  Sold = 'Sold',
}

export interface TimeRendererProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

export interface NFTCollection {
  listId: string;
  name: string;
  desc: string;
  hash: string;
  nftAddress: string;
  tokenId: string;
  image: string;
  ipfs: string;
  maker: string;
  minter: string;
  auction: boolean;
  category: string;
  tags: string[];
  price: string;
  bestPrice: string;
  bestBidder: string;
  bestBidHash: string;
  mimeType: string;
  mintTime: string;
  listingTime: string;
  expirationTime: string;
  status: ListStatus;
}

export interface BidOrder {
  parentId: string;
  price: string;
  taker: string;
  createTime: string;
}

export interface UserItem {
  id: string;
  nftAddress: string;
  maker: string;
  owner: string;
  tokenId: number;
  tokenUri: string;
  image: string;
  name: string;
  desc: string;
  mimeType: string;
  listing: boolean;
}

export interface Order {
  exchange: string;
  maker: string;
  taker: string;
  royaltyRecipient: string;
  side: BigNumber;
  nftAddress: string;
  tokenId: BigNumber;
  basePrice: BigNumber;
  listingTime: BigNumber;
  expirationTime: BigNumber;
  paymentToken: string;
}

export interface Sig {
  v: number;
  r: string;
  s: string;
}

export interface UserProfile {
  address: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  webSite: string;
  discord: string;
  twitter: string;
  instagram: string;
  createdAt: string;
}

export interface CollectionProfile {
  user: UserProfile[];
  collectionId: string;
  name: string;
  createdBy: string;
  description: string;
  coverImage: string;
  cardImage: string;
  webSite: string;
  discord: string;
  twitter: string;
  instagram: string;
  items: NFTCollection[];
}

export interface FollowedUsers {
  username: string;
  followed: string[];
  user: UserProfile[];
  createdAt: string;
}

export interface FollowingUsers {
  username: string;
  following: string[];
  user: UserProfile[];
  createdAt: string;
}
