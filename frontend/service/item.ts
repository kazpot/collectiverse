import { ethers } from 'ethers';
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json';
import Exchange from '../../artifacts/contracts/Exchange.sol/Exchange.json';
import axios from 'axios';
import { zeroAddress } from '../common/const';
import { BidOrder, Side, UserItem, NFTCollection, ListStatus } from '../common/types';
import { getCurrentUser } from '../common/util';

const nftAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS || '';
const exchangeAddress = process.env.NEXT_PUBLIC_EXCHANGE_ADDRESS || '';
const apiServerUri = process.env.NEXT_PUBLIC_API_SERVER_URI || '';

const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
const nft = new ethers.Contract(nftAddress, NFT.abi, provider);
const exchange = new ethers.Contract(exchangeAddress, Exchange.abi, provider);

/**
 * @deprecated Get the latest 20 items
 * @returns NFTCollection[]
 */
export const getLatestMarketItems = async (): Promise<NFTCollection[]> => {
  let items: NFTCollection[] = [];
  try {
    const { data } = await axios.get(`${apiServerUri}/api/list/latest`);
    items = data;
  } catch (error) {
    console.error(error);
  }
  return items;
};

/**
 * @deprecated Get itmes by user address which is only on this platform
 * @param makerAddress
 * @param status
 * @returns
 */
export const getNFTCollectionsByMaker = async (
  makerAddress: string,
  status?: ListStatus,
): Promise<NFTCollection[]> => {
  let newNFTCollection: NFTCollection[] = [];
  try {
    let items;
    if (status !== undefined) {
      const { data } = await axios.post(`${apiServerUri}/api/list/maker`, {
        maker: makerAddress,
        status,
      });
      items = data;
    } else {
      const { data } = await axios.post(`${apiServerUri}/api/list/maker`, {
        maker: makerAddress,
      });
      items = data;
    }

    for (let i = 0; i < items.length; i++) {
      const tokenId = ethers.BigNumber.from(items[i].tokenId);
      const address = await nft.ownerOf(tokenId);

      // user must be current NFT owner
      if (address.toLowerCase() !== makerAddress.toLowerCase()) {
        continue;
      }

      newNFTCollection.push(items[i]);
    }
  } catch (error) {
    console.error(error);
  }
  return newNFTCollection;
};

/**
 * Get minter of NTF by its tokenId
 * @param tokenId
 * @returns string
 */
export const getMinter = async (tokenId: number): Promise<string> => {
  const nftOwnerFilter = nft.filters.Transfer(zeroAddress, null, ethers.BigNumber.from(tokenId));
  const nftEvents: ethers.Event[] = await nft.queryFilter(nftOwnerFilter);
  const owner = nftEvents[0].args?.[1];
  return owner;
};

/**
 * @deprecated NFTs that are owned by specified address
 * @param userAddress
 * @returns UserItem[]
 */
export const getUserItems = async (userAddress: string): Promise<UserItem[]> => {
  let userItems = [];
  try {
    // Transfer(from, to, tokenId)
    const eventFilter = nft.filters.Transfer(null, userAddress, null);
    const events: ethers.Event[] = await nft.queryFilter(eventFilter);

    if (!events.length || events.length === 0) {
      return [];
    }

    for (let i = 0; i < events.length; i++) {
      const tokenId = events[i].args?.[2];
      const address = await nft.ownerOf(tokenId);

      // user must be current NFT owner
      if (address.toLowerCase() !== userAddress.toLowerCase()) {
        continue;
      }

      const nftOwnerFilter = nft.filters.Transfer(zeroAddress, null, tokenId);
      const nftEvents: ethers.Event[] = await nft.queryFilter(nftOwnerFilter);
      const owner = nftEvents[0].args?.[1];

      const tokenUri = await nft.tokenURI(tokenId);
      const item = await axios.get(tokenUri);

      const res = await axios.get(item.data.image);
      const mimeType = res.headers['content-type'];

      userItems.push({
        id: `${nftAddress}:${tokenId}`,
        nftAddress: nft.address,
        maker: address,
        owner,
        tokenId,
        tokenUri,
        image: item.data.image,
        name: item.data.name,
        desc: item.data.description,
        mimeType,
        listing: false,
      });
    }
  } catch (error) {
    console.error(error);
  }
  return userItems;
};

/**
 * NFTs that are owned by specified user address by nft docs
 * @param userAddress
 * @param nftDocs
 * @returns UserItem[]
 */
export const getUserItemsByTokenIds = async (
  userAddress: string,
  nftDocs: any[],
): Promise<UserItem[]> => {
  let userItems = [];
  try {
    for (let i = 0; i < nftDocs.length; i++) {
      const tokenId = nftDocs[i].tokenId;
      const owner = nftDocs[i].owner;
      const tokenUri = nftDocs[i].tokenUri;
      const name = nftDocs[i].name;
      const desc = nftDocs[i].description;
      const image = nftDocs[i].image;
      const mimeType = nftDocs[i].mimeType;

      // user must be current NFT owner
      if (owner != userAddress) {
        continue;
      }

      userItems.push({
        id: `${nftAddress}:${tokenId}`,
        nftAddress: nft.address,
        maker: owner,
        owner,
        tokenId,
        tokenUri,
        image,
        name,
        desc,
        mimeType,
        listing: false,
      });
    }
  } catch (error) {
    console.error(error);
  }
  return userItems;
};

/**
 * Get all bids for item
 * @param sellItem
 * @returns
 */
export const getBidOrders = async (sellItem: NFTCollection): Promise<BidOrder[]> => {
  const eventFilter = exchange.filters.OrderCreated(Side.Buy, sellItem.bestBidHash, zeroAddress);
  const events: ethers.Event[] = await exchange.queryFilter(eventFilter);

  let buyItems: ethers.Event[] = [];
  for (let i = 0; i < events.length; i++) {
    const side = events[i].args?.[0];
    const hash = events[i].args?.[1];
    const nftAddress = events[i].args?.[5];
    const tokenId = events[i].args?.[6];
    const cancelledOrFinalized = await exchange.cancelledOrFinalized(hash);
    if (
      side === Side.Buy &&
      !cancelledOrFinalized &&
      nftAddress.toLowerCase() === sellItem.nftAddress.toLowerCase() &&
      tokenId == sellItem.tokenId
    ) {
      buyItems.push(events[i]);
    }
  }

  const bidOrders = await Promise.all(
    buyItems.map(async (e: ethers.Event): Promise<BidOrder> => {
      const taker = e.args?.[3];
      const createTime = e.args?.[8];
      const bidPrice = ethers.utils.formatUnits(e.args?.[7], 'ether');

      return {
        parentId: sellItem.listId,
        price: bidPrice,
        taker,
        createTime: createTime.toString(),
      };
    }),
  );
  return bidOrders;
};

/**
 * Update owned nft items
 * @param userAddress
 * @param nftAddress
 * @returns
 */
export const updateOwnedItems = async (
  holderAddress: string,
  holderNftAddress: string | null | undefined,
): Promise<Boolean> => {
  try {
    const nftAddr = holderNftAddress ? holderNftAddress : nftAddress;
    const nft = new ethers.Contract(nftAddr, NFT.abi, provider);

    // event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    const receivedFilter = nft.filters.Transfer(null, holderAddress, null);
    const sentFilter = nft.filters.Transfer(holderAddress, null, null);

    const receivedEvents = await nft.queryFilter(receivedFilter);
    const sentEvents = await nft.queryFilter(sentFilter);

    const events = sentEvents
      .concat(receivedEvents)
      .sort((a, b) => a.blockNumber - b.blockNumber || a.transactionIndex - b.transactionIndex);

    const owned = new Set<number>();

    for (const event of events) {
      if (event.args) {
        const { from, to, tokenId } = event.args;

        if (to === holderAddress) {
          owned.add(Number(tokenId));
        } else if (from === holderAddress) {
          owned.delete(Number(tokenId));
        }
      }
    }

    let userItems = [];
    for (const tokenId of owned.values()) {
      const tokenUri = await nft.tokenURI(tokenId);
      try {
        // check tokenUri is valid URL, if not throw error
        new URL(tokenUri);

        const result = await axios.get(tokenUri);
        const req = await fetch(result.data.image, { method: 'HEAD' });
        const mimeType = req.headers.get('content-type') || '';

        userItems.push({
          tokenId,
          image: result.data.image,
          name: result.data.name,
          description: result.data.description,
          mimeType,
          tokenUri,
        });
      } catch (error) {
        console.log(
          `Failed to get meta data of nftAddress: ${nftAddr}, tokenId: ${tokenId}, tokenUri: ${tokenUri}`,
        );
        continue;
      }
    }

    if (userItems.length === 0) {
      return false;
    }

    const signer = await getCurrentUser();
    const currentUserAddress = await signer.getAddress();
    const sig = await signer.signMessage(currentUserAddress);
    await axios.post(`${apiServerUri}/api/nfts`, {
      userItems,
      owner: holderAddress,
      nftAddress: nftAddr,
      sig,
    });
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};
