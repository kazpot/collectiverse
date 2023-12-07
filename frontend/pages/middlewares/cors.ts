import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const corsMiddleware =
  (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
      );

      res.status(200).end();
      return;
    }

    return handler(req, res);
  };

export default corsMiddleware;
