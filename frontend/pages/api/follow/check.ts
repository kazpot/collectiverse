import nc from 'next-connect';
import db from '../../../utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import FollowedUser from '../../../models/FollowedUser';
import corsMiddleware from '../../middlewares/cors';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _, res) => {
    console.error(err);
    res.status(500).end(err.toString());
  },
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

  const { username, follower } = req.body;
  const followedUser = await FollowedUser.findOne(
    { username },
    { followed: { $elemMatch: { $eq: follower } } },
  );

  if (followedUser && followedUser.followed.length > 0) {
    return res.send(true);
  }
  res.send(false);
});

export default corsMiddleware(handler);
