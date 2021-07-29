import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from '../../../middleware/auth';
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie';

function handler(req: NextApiRequest, res: NextApiResponse ){

   switch (req.method) {
      case 'GET':
         return refreshToken()
         
      default:
         return res.status(400).send('No method provider')
    }

    async function refreshToken() {
        const refreshToken = getCookie(req, 'next-refresh-token')
        if(!refreshToken) return res.status(404).setHeader('Set-Cookie', [
            serialize('next-token', '', {
              maxAge: -1,
              path: '/',
            }),
            serialize('next-refresh-token', '', {
              maxAge: -1,
              path: '/',
            }),
          ]).send('No refresh-token provided')
        
        const payload:any = jwt.decode(refreshToken)
        if(!payload) return res.status(401).send('Token inválido')
        
        const token = jwt.sign({ user: payload.user }, `${process.env.JWT_SECRET}`, {expiresIn: '5mins'})
        
        return res
        .setHeader('Set-Cookie',
            serialize('next-token', token, {path: '/' })
        ).send('Login feito com sucesso')
    }

}

export default handler