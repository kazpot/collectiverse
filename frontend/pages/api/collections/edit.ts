import nc from 'next-connect';
import db from '../../../utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import Collection from '../../../models/Collection';
import { CollectionProfile } from '../../../common/types';
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
  const { collProfile, sig }: { collProfile: CollectionProfile; sig: string } = req.body;

  // verify signature
  const recoveredAddr = ethers.utils.verifyMessage(collProfile.createdBy, sig);
  if (recoveredAddr !== collProfile.createdBy) {
    return res.status(401).send({ message: 'signature is invalid' });
  }

  const collDoc = await Collection.findOne({ collectionId: collProfile.collectionId });
  if (!collDoc) {
    const coll = new Collection({
      ...collProfile,
    });
    await coll.save();
  } else {
    await Collection.updateOne(
      { collectionId: collProfile.collectionId },
      {
        $set: {
          description: collProfile.description,
          coverImage: collProfile.coverImage,
          webSite: collProfile.webSite,
          discord: collProfile.discord,
          twitter: collProfile.twitter,
          instagram: collProfile.instagram,
        },
        $currentDate: { lastModified: true },
      },
    );
  }
  res.send('success');
});

export default corsMiddleware(handler);
