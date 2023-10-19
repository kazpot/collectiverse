import nc from 'next-connect';
import db from '../../../utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import Collection from '../../../models/Collection';
import { CollectionProfile } from '../../../common/types';
import { ethers } from 'ethers';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _, res) => {
    console.error(err);
    res.status(500).end(err.toString());
  },
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const { collProfile, sig }: { collProfile: CollectionProfile; sig: string } = req.body;

  // verify signature
  const recoveredAddr = ethers.utils.verifyMessage(collProfile.createdBy, sig);
  if (recoveredAddr !== collProfile.createdBy) {
    return res.status(401).send({ message: 'signature is invalid' });
  }

  const collDoc = await Collection.findOne({ collectionId: collProfile.collectionId });
  if (!collDoc) {
    return res.status(404).send({ message: 'collection not found' });
  } else {
    await Collection.deleteOne({ collectionId: collProfile.collectionId });
  }
  res.send('success');
});

export default handler;
