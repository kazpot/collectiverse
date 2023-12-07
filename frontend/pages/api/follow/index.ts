import nc from 'next-connect';
import db from '../../../utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import FollowedUser from '../../../models/FollowedUser';
import FollowingUser from '../../../models/FollowingUser';
import mongoose from 'mongoose';
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

  const { username, follower, sig } = req.body;

  // verify signature
  const recoveredAddr = ethers.utils.verifyMessage(follower, sig);
  if (recoveredAddr !== follower) {
    return res.status(401).send({ message: 'signature is invalid' });
  }

  const alreadyFollowed = await FollowedUser.findOne(
    { username },
    { followed: { $elemMatch: { $eq: follower } } },
  );
  if (alreadyFollowed && alreadyFollowed.followed.length > 0) {
    return res.send('already followed');
  }

  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    const followedUserExists = await FollowedUser.findOne({ username });
    if (followedUserExists) {
      await FollowedUser.updateOne({ username }, { $push: { followed: follower } });
    } else {
      const followedUser = new FollowedUser({
        username,
        followed: [follower],
      });
      await followedUser.save();
    }

    const followingUserExists = await FollowingUser.findOne({ username: follower });
    if (followingUserExists) {
      await FollowingUser.updateOne({ username: follower }, { $push: { following: username } });
    } else {
      const followingUser = new FollowingUser({
        username: follower,
        following: [username],
      });
      await followingUser.save();
    }
    return res.send('success');
  });
});

export default corsMiddleware(handler);
