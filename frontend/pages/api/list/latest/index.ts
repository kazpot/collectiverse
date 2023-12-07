import nc from 'next-connect';
import db from '../../../../utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import List from '../../../../models/List';
import { ListStatus } from '../../../../common/types';
import corsMiddleware from '../../../middlewares/cors';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _, res) => {
    console.error(err);
    res.status(500).end(err.toString());
  },
});

handler.get(async (_req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const items = await List.find({ status: ListStatus.Listing }).sort({ createdAt: -1 }).limit(20);
  res.send(items);
});

export default corsMiddleware(handler);
