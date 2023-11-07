import { ethers } from 'ethers';
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json';
import Exchange from '../../artifacts/contracts/Exchange.sol/Exchange.json';
//import WETH from '../../artifacts/contracts/MockWETH.sol/MockWETH.json';
import { BidOrder, NFTCollection, Order, Side, Sig, ListStatus } from '../common/types';
import { emptySig, zeroAddress } from '../common/const';
import { getCurrentUser, listId, signOrder } from '../common/util';
import axios from 'axios';

const nftAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS || '';
const exchangeAddress = process.env.NEXT_PUBLIC_EXCHANGE_ADDRESS || '';
//const wethAddress = process.env.NEXT_PUBLIC_WETH_ADDRESS || '';
const apiServerUri = process.env.NEXT_PUBLIC_API_SERVER_URI || '';

/**
 * Mint NFT
 * @param imageUrl
 * @param name
 * @param desc
 * @param ipfsFilePathUrl
 * @param basePrice
 * @param expirationTimeInMiliSec
 * @param isAuction
 * @param category
 * @param mimeType
 * @param tags
 * @returns string
 */
export const mint = async (
  imageUrl: string,
  name: string,
  desc: string,
  ipfsFilePathUrl: string,
  basePrice: string,
  expirationTimeInMiliSec: number,
  isAuction: boolean,
  category: string,
  mimeType: string,
  tags: string[],
): Promise<{ nftCollection: NFTCollection | null; result: boolean; mintTxHash: string | null }> => {
  const signer = await getCurrentUser();

  // mint
  let listItem: NFTCollection;
  let tx: any;
  try {
    const nft = new ethers.Contract(nftAddress, NFT.abi, signer);
    let transaction = await nft.createToken(ipfsFilePathUrl);
    tx = await transaction.wait();
    console.log(tx);

    const expirationTime = Math.floor(expirationTimeInMiliSec / 1000);

    const mintTime = Math.floor(Date.now() / 1000);

    const tokenId = tx.events[0].args[2].toNumber();

    listItem = {
      nftAddress: nft.address,
      minter: await signer.getAddress(),
      tokenId,
      name,
      desc,
      price: basePrice,
      expirationTime: expirationTime.toString(),
      mintTime: mintTime.toString(),
      auction: isAuction,
      category,
      tags,
      ipfs: ipfsFilePathUrl,
      image: imageUrl,
      mimeType,
      listId: '',
      hash: '',
      maker: '',
      listingTime: '',
      status: ListStatus.Listing,
      bestPrice: '',
    };
  } catch (error) {
    console.error(error);
    return { nftCollection: null, result: false, mintTxHash: null };
  }
  return { nftCollection: listItem, result: true, mintTxHash: tx.transactionHash };
};

/**
 * List NFT
 * @param item
 */
export const list = async (
  item: NFTCollection,
): Promise<{
  result: boolean;
  listTxHash: string | null;
  listedItem: NFTCollection | null;
  reason?: string;
}> => {
  let tx: any;
  try {
    const signer = await getCurrentUser();
    const price = ethers.utils.parseUnits(item.price.toString(), 'ether');
    const listingTime = Math.floor(Date.now() / 1000);
    const expirationTime = item.expirationTime;
    const maker = await signer.getAddress();

    const nft = new ethers.Contract(nftAddress, NFT.abi, signer);
    const exchange = new ethers.Contract(exchangeAddress, Exchange.abi, signer);

    const proxyImplAddress = await exchange.proxyImplementation();

    let sell: Order;
    if (item.auction.toString() == 'true') {
      sell = {
        exchange: exchangeAddress,
        maker,
        taker: zeroAddress,
        royaltyRecipient: item.minter != maker ? item.minter : zeroAddress,
        side: ethers.BigNumber.from(Side.Sell),
        nftAddress: item.nftAddress,
        tokenId: ethers.BigNumber.from(item.tokenId),
        basePrice: price,
        listingTime: ethers.BigNumber.from(listingTime),
        expirationTime: ethers.BigNumber.from(expirationTime),
        paymentToken: zeroAddress,
      };
    } else {
      sell = {
        exchange: exchangeAddress,
        maker,
        taker: zeroAddress,
        royaltyRecipient: item.minter != maker ? item.minter : zeroAddress,
        side: ethers.BigNumber.from(Side.Sell),
        nftAddress: item.nftAddress,
        tokenId: ethers.BigNumber.from(item.tokenId),
        basePrice: price,
        listingTime: ethers.BigNumber.from(listingTime),
        expirationTime: ethers.BigNumber.from(0),
        paymentToken: zeroAddress,
      };
    }

    // if user rejects approval, it throws exception
    const t1 = await nft.approve(proxyImplAddress, item.tokenId);
    tx = await t1.wait();
    console.log(tx);

    const transaction = await exchange.createOrder(sell);
    tx = await transaction.wait();
    console.log(tx);

    const hash = tx.events[0].args?.[1];

    const sig = await signer.signMessage(hash);

    const res = await axios.post(`${apiServerUri}/api/list`, {
      item: {
        hash,
        nftAddress: item.nftAddress,
        tokenId: item.tokenId,
        maker: sell.maker,
        listingTime: listingTime.toString(),
        mintTime: item.mintTime.toString(),
        expirationTime: item.expirationTime,
        image: item.image,
        ipfs: item.ipfs,
        price: item.price,
        name: item.name,
        desc: item.desc,
        minter: item.minter,
        auction: item.auction.toString() == 'true' ? true : false,
        category: item.category,
        tags: item.tags,
        mimeType: item.mimeType,
      },
      tx: tx.transactionHash,
      sig,
    });
    return { result: true, listTxHash: tx.transactionHash, listedItem: res.data };
  } catch (error) {
    console.error(error);
    return { result: false, listTxHash: null, listedItem: null, reason: 'exception' };
  }
};

/**
 * Place bid
 * @param item
 * @param bidPrice
 */
export const createBidOrder = async (item: NFTCollection, bidPrice: string): Promise<boolean> => {
  const signer = await getCurrentUser();

  try {
    const price = ethers.utils.parseUnits(bidPrice, 'ether');
    const listingTime = Math.floor(Date.now() / 1000);

    const exchange = new ethers.Contract(exchangeAddress, Exchange.abi, signer);
    // const weth = new ethers.Contract(wethAddress, WETH.abi, signer);

    const taker = await signer.getAddress();

    const buy: Order = {
      exchange: exchangeAddress,
      maker: zeroAddress,
      taker,
      royaltyRecipient: item.minter != item.maker ? item.minter : zeroAddress,
      side: ethers.BigNumber.from(Side.Buy),
      nftAddress: item.nftAddress,
      tokenId: ethers.BigNumber.from(item.tokenId),
      basePrice: price,
      listingTime: ethers.BigNumber.from(listingTime),
      expirationTime: ethers.BigNumber.from(item.expirationTime),
      paymentToken: zeroAddress,
    };

    const t = await exchange.createOrder(buy, { value: price });
    const tx = await t.wait();
    console.log(tx);

    // const t2 = await weth.approve(exchange.address, price);
    // const tx2 = await t2.wait();
    // console.log(tx2);

    const hash = tx.events[0].args?.[1];

    const sig = await signer.signMessage(hash);

    await axios.post(`${apiServerUri}/api/bid`, {
      order: {
        parentId: item.listId,
        hash,
        price: bidPrice,
        taker,
        createTime: listingTime.toString(),
        active: true,
      },
      tx: tx.transactionHash,
      sig,
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Cancel order
 * @param item
 */
export const cancelOrder = async (item: NFTCollection): Promise<boolean> => {
  const signer = await getCurrentUser();
  const price = ethers.utils.parseUnits(item.price.toString(), 'ether');

  try {
    const sell: Order = {
      exchange: exchangeAddress,
      maker: item.maker,
      taker: zeroAddress,
      royaltyRecipient: item.minter != item.maker ? item.minter : zeroAddress,
      side: ethers.BigNumber.from(Side.Sell),
      nftAddress: item.nftAddress,
      tokenId: ethers.BigNumber.from(item.tokenId),
      basePrice: price,
      listingTime: ethers.BigNumber.from(item.listingTime),
      expirationTime: ethers.BigNumber.from(item.expirationTime),
      paymentToken: zeroAddress,
    };

    const sig: Sig = await signOrder(sell);
    const exchange = new ethers.Contract(exchangeAddress, Exchange.abi, signer);
    const transaction = await exchange.cancelOrder(sell, sig);
    const tx = await transaction.wait();
    console.log(tx);

    // delist item
    const cancelHash = tx.events[0].args?.[0];
    const userSig = await signer.signMessage(cancelHash);
    const id = listId(item.listingTime, item.maker);
    await axios.post(`${apiServerUri}/api/list/cancel/${id}`, {
      cancelHash,
      userAddress: item.maker,
      sig: userSig,
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Instant purchase
 * @param item
 */
export const buyNowOrder = async (item: NFTCollection): Promise<boolean> => {
  const signer = await getCurrentUser();
  const takerAddress = await signer.getAddress();
  const price = ethers.utils.parseUnits(item.price.toString(), 'ether');

  try {
    const sell: Order = {
      exchange: exchangeAddress,
      maker: item.maker,
      taker: zeroAddress,
      royaltyRecipient: item.minter != item.maker ? item.minter : zeroAddress,
      side: ethers.BigNumber.from(Side.Sell),
      nftAddress: item.nftAddress,
      tokenId: ethers.BigNumber.from(item.tokenId),
      basePrice: price,
      listingTime: ethers.BigNumber.from(item.listingTime),
      expirationTime: ethers.BigNumber.from(0),
      paymentToken: zeroAddress,
    };

    const buy: Order = {
      exchange: exchangeAddress,
      maker: zeroAddress,
      taker: takerAddress,
      royaltyRecipient: item.minter != item.maker ? item.minter : zeroAddress,
      side: ethers.BigNumber.from(Side.Buy),
      nftAddress: item.nftAddress,
      tokenId: ethers.BigNumber.from(item.tokenId),
      basePrice: price,
      listingTime: ethers.BigNumber.from(item.listingTime),
      expirationTime: ethers.BigNumber.from(0),
      paymentToken: zeroAddress,
    };

    const sig: Sig = await signOrder(buy);
    const exchange = new ethers.Contract(exchangeAddress, Exchange.abi, signer);
    const transaction = await exchange.acceptOrder(buy, sig, sell, emptySig, { value: price });
    const tx = await transaction.wait();
    console.log(tx);

    // delist item
    const buyHash = tx.events[0].args?.[0];
    const sellHash = tx.events[0].args?.[1];

    const userSig = await signer.signMessage(takerAddress);

    const id = listId(item.listingTime, item.maker);
    await axios.post(`${apiServerUri}/api/list/accept/${id}`, {
      buyHash,
      sellHash,
      tx: tx.transactionHash,
      userAddress: takerAddress,
      sig: userSig,
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Accept bid
 * @param item
 * @param bestBidOrder
 */
export const acceptBidOrder = async (
  item: NFTCollection,
  bestBidOrder: BidOrder,
): Promise<boolean> => {
  const signer = await getCurrentUser();
  const floorPrice = ethers.utils.parseUnits(item.price.toString(), 'ether');
  const bestBidPrice = ethers.utils.parseUnits(bestBidOrder.price.toString(), 'ether');

  try {
    const sell: Order = {
      exchange: exchangeAddress,
      maker: item.maker,
      taker: zeroAddress,
      royaltyRecipient: item.minter != item.maker ? item.minter : zeroAddress,
      side: ethers.BigNumber.from(Side.Sell),
      nftAddress: item.nftAddress,
      tokenId: ethers.BigNumber.from(item.tokenId),
      basePrice: floorPrice,
      listingTime: ethers.BigNumber.from(item.listingTime),
      expirationTime: ethers.BigNumber.from(item.expirationTime),
      paymentToken: zeroAddress,
    };

    const buy: Order = {
      exchange: exchangeAddress,
      maker: zeroAddress,
      taker: bestBidOrder.taker,
      royaltyRecipient: item.minter != item.maker ? item.minter : zeroAddress,
      side: ethers.BigNumber.from(Side.Buy),
      nftAddress: item.nftAddress,
      tokenId: ethers.BigNumber.from(item.tokenId),
      basePrice: ethers.BigNumber.from(bestBidPrice),
      listingTime: ethers.BigNumber.from(bestBidOrder.createTime),
      expirationTime: ethers.BigNumber.from(item.expirationTime),
      paymentToken: zeroAddress,
    };

    const sig: Sig = await signOrder(sell);
    const exchange = new ethers.Contract(exchangeAddress, Exchange.abi, signer);
    //const weth = new ethers.Contract(wethAddress, WETH.abi, signer);

    //const commissionFeeRate = await exchange.commissionFee();
    //const commissionFee = bestBidPrice.mul(commissionFeeRate).div(1000);
    //await weth.approve(exchange.address, ethers.BigNumber.from(commissionFee));

    const transaction = await exchange.acceptOrder(buy, emptySig, sell, sig);
    const tx = await transaction.wait();
    console.log(tx);

    // delist item
    const buyHash = tx.events[0].args?.[0];
    const sellHash = tx.events[0].args?.[1];

    const userSig = await signer.signMessage(item.maker);

    const id = listId(item.listingTime, item.maker);
    await axios.post(`${apiServerUri}/api/list/accept/${id}`, {
      buyHash,
      sellHash,
      tx: tx.transactionHash,
      userAddress: item.maker,
      sig: userSig,
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
