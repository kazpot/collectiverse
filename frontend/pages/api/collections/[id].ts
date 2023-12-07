import nc from 'next-connect';
import db from '../../../utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import Collection from '../../../models/Collection';
import corsMiddleware from '../../middlewares/cors';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _, res) => {
    console.error(err);
    res.status(500).end(err.toString());
  },
});

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const collDoc = await Collection.findOne({ collectionId: req.query.id });
  if (collDoc) {
    return res.send(collDoc);
  }
  res.status(404).send('collection not found');
});

export default corsMiddleware(handler);
