import nc from 'next-connect';
import db from '../../../utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../models/User';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _, res) => {
    console.error(err);
    res.status(500).end(err.toString());
  },
});

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const userDoc = await User.findOne({ address: req.query.id });
  if (userDoc) {
    return res.send(userDoc);
  }
  res.status(404).send('user not found');
});

export default handler;
