import nc from 'next-connect';
import db from '../../../utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import FollowedUser from '../../../models/FollowedUser';
import FollowingUser from '../../../models/FollowingUser';
import corsMiddleware from '../../middlewares/cors';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _, res) => {
    console.error(err);
    res.status(500).end(err.toString());
  },
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

  const { username } = req.body;

  const followedUsers = await FollowedUser.aggregate([
    { $match: { username } },
    { $unwind: '$followed' },
    {
      $lookup: {
        from: 'users',
        localField: 'followed',
        foreignField: 'address',
        as: 'user',
      },
    },
  ]);
  const followingUsers = await FollowingUser.aggregate([
    { $match: { username } },
    {
      $lookup: {
        from: 'users',
        localField: 'username',
        foreignField: 'address',
        as: 'user',
      },
    },
  ]);

  res.send({
    followed: followedUsers ? followedUsers : [],
    following: followingUsers ? followingUsers : [],
  });
});

export default corsMiddleware(handler);
