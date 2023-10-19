import nc from 'next-connect';
import db from '../../../utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../models/User';
import { ethers } from 'ethers';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _, res) => {
    console.error(err);
    res.status(500).end(err.toString());
  },
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

  const { address, sig } = req.body;

  // verify signature
  const recoveredAddr = ethers.utils.verifyMessage(address, sig);
  if (recoveredAddr !== address) {
    return res.status(401).send({ message: 'signature is invalid' });
  }

  const exist = await User.findOne({ address });
  if (exist) {
    return res.send({ message: 'user exists' });
  } else {
    const user = new User({
      address,
      username: '@' + address,
    });
    await user.save();
    return res.send({ message: 'user created' });
  }
});

export default handler;
