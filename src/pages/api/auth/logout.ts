import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

function handler(req: NextApiRequest, res: NextApiResponse ){

   switch (req.method) {
      case 'GET':
         return deleteAllCookies()

      default:
         return res.status(400).send('No method provider')
    }

    async function deleteAllCookies() {
        return res.setHeader('Set-Cookie', [
            serialize('next-token', '', {
              maxAge: -1,
              path: '/',
            }),
            serialize('next-refresh-token', '', {
              maxAge: -1,
              path: '/',
            }),
          ]).redirect('/')
    }

  }

export default handler