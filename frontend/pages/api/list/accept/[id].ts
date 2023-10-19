import nc from 'next-connect';
import db from '../../../../utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import List from '../../../../models/List';
import { ListStatus } from '../../../../common/types';
import { ethers } from 'ethers';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _, res) => {
    console.error(err);
    res.status(500).end(err.toString());
  },
});

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const list = await List.findOne({ listId: req.query.id });
  res.send(list);
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

  const { userAddress, sig } = req.body;

  // verify signature
  const recoveredAddr = ethers.utils.verifyMessage(userAddress, sig);
  if (recoveredAddr !== userAddress) {
    return res.status(401).send({ message: 'signature is invalid' });
  }

  await List.updateOne(
    { listId: req.query.id },
    {
      $set: { status: ListStatus.Sold },
      $currentDate: { lastModified: true },
    },
  );

  res.send('success');
});

export default handler;
