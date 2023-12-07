import nc from 'next-connect';
import db from '../../../utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import List from '../../../models/List';
import { listId } from '../../../common/util';
import { NFTCollection, ListStatus } from '../../../common/types';
import { ethers } from 'ethers';
import corsMiddleware from '../../middlewares/cors';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _, res) => {
    console.error(err);
    res.status(500).end(err.toString());
  },
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

  const { item, tx, sig }: { item: NFTCollection; tx: string; sig: string } = req.body;
  const tags = item.tags.map((tag: string) => tag.toUpperCase());

  // verify signature
  const recoveredAddr = ethers.utils.verifyMessage(item.hash, sig);
  if (recoveredAddr !== item.maker) {
    return res.status(401).send({ message: 'signature is invalid' });
  }

  const list = new List({
    listId: listId(item.listingTime, item.maker),
    hash: item.hash,
    nftAddress: item.nftAddress,
    tokenId: item.tokenId,
    image: item.image,
    ipfs: item.ipfs,
    price: item.price,
    mintTime: item.mintTime,
    listingTime: item.listingTime,
    expirationTime: item.expirationTime,
    maker: item.maker,
    name: item.name,
    desc: item.desc,
    minter: item.minter,
    auction: item.auction,
    category: item.category,
    tags,
    status: ListStatus.Listing,
    mimeType: item.mimeType,
    tx,
  });
  await list.save();
  res.send(list);
});

export default corsMiddleware(handler);
