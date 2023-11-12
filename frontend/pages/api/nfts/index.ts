import nc from 'next-connect';
import db from '../../../utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import Nft from '../../../models/Nft';
import { ethers } from 'ethers';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _, res) => {
    console.error(err);
    res.status(500).end(err.toString());
  },
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

  const { userItems, owner, nftAddress, sig } = req.body;

  // verify signature
  const recoveredAddr = ethers.utils.verifyMessage(owner, sig);
  if (recoveredAddr !== owner) {
    return res.status(401).send({ message: 'signature is invalid' });
  }

  await Nft.deleteMany({ owner, nftAddress });

  for (const userItem of userItems) {
    const nft = new Nft({
      tokenId: userItem.tokenId,
      nftAddress,
      owner,
      tokenUri: userItem.tokenUri,
      name: userItem.name,
      description: userItem.description,
      image: userItem.image,
      mimeType: userItem.mimeType,
    });
    await nft.save();
  }

  res.send('success');
});

export default handler;
