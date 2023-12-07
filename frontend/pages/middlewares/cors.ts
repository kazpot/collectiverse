import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const allowedOrigin = process.env.NEXT_PUBLIC_API_SERVER_URI || '';

const corsMiddleware =
  (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
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
