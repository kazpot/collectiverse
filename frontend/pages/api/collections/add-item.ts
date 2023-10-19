import nc from 'next-connect';
import db from '../../../utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import Collection from '../../../models/Collection';
import { ethers } from 'ethers';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _, res) => {
    console.error(err);
    res.status(500).end(err.toString());
  },
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const { collectionId, listId, userAddress, sig } = req.body;

  // verify signature
  const recoveredAddr = ethers.utils.verifyMessage(userAddress, sig);
  if (recoveredAddr !== userAddress) {
    return res.status(401).send({ message: 'signature is invalid' });
  }

  const exist = await Collection.findOne({ collectionId });
  if (!exist) {
    return res.send({ message: 'The collection does not exist' });
  } else {
    const items = await Collection.find({ items: [listId] });
    if (items.length > 0) {
      return res.send({ message: 'Item has already been added to the collection' });
    }
    await Collection.updateOne({ collectionId }, { $push: { items: listId } });
    return res.send({ message: 'Item has been added to the collection' });
  }
});

export default handler;
