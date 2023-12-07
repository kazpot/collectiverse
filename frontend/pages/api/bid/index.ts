import nc from 'next-connect';
import db from '../../../utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import Bid from '../../../models/Bid';
import List from '../../../models/List';
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

  const { order, tx, sig } = req.body;

  // verify signature
  const recoveredAddr = ethers.utils.verifyMessage(order.hash, sig);
  if (recoveredAddr !== order.taker) {
    return res.status(401).send({ message: 'signature is invalid' });
  }

  const bid = new Bid({
    parentId: order.parentId,
    hash: order.hash,
    price: order.price,
    taker: order.taker,
    createTime: order.createTime,
    tx,
  });
  await bid.save();

  const bestBids = await Bid.find({ parentId: order.parentId }).sort({ price: -1 }).limit(1);

  await List.updateOne(
    { listId: order.parentId },
    {
      $set: {
        bestPrice: bestBids[0].price,
        bestBidder: bestBids[0].taker,
        bestBidHash: bestBids[0].hash,
      },
      $currentDate: { lastModified: true },
    },
  );

  res.send('success');
});

export default corsMiddleware(handler);
