import nc from 'next-connect';
import db from '../../../../utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import List from '../../../../models/List';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, _, res) => {
    console.error(err);
    res.status(500).end(err.toString());
  },
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

  const { maker, status } = req.body;

  let items;
  if (status) {
    items = await List.find({ maker, status });
  } else {
    items = await List.find({ maker });
  }
  res.send(items);
});

export default handler;
