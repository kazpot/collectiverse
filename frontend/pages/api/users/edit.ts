import nc from 'next-connect';
import db from '../../../utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../models/User';
import { UserProfile } from '../../../common/types';
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
  const { userProfile, sig }: { userProfile: UserProfile; sig: string } = req.body;

  // verify signature
  const recoveredAddr = ethers.utils.verifyMessage(userProfile.address, sig);
  if (recoveredAddr !== userProfile.address) {
    return res.status(401).send({ message: 'signature is invalid' });
  }

  const userDoc = await User.findOne({ address: userProfile.address });
  if (!userDoc) {
    const user = new User({
      ...userProfile,
      username: '@' + userProfile.username,
    });
    await user.save();
  } else {
    await User.updateOne(
      { address: userProfile.address },
      {
        $set: {
          username: userProfile.username.startsWith('@')
            ? userProfile.username
            : '@' + userProfile.username,
          email: userProfile.email,
          name: userProfile.name,
          bio: userProfile.bio,
          profileImage: userProfile.profileImage,
          coverImage: userProfile.coverImage,
          webSite: userProfile.webSite,
          discord: userProfile.discord,
          twitter: userProfile.twitter,
          instagram: userProfile.instagram,
        },
        $currentDate: { lastModified: true },
      },
    );
  }
  res.send('success');
});

export default corsMiddleware(handler);
