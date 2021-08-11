import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from '../../../middleware/auth';
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie';
import { prisma } from '../../../utils/database';

function handler(req: NextApiRequest, res: NextApiResponse ){

   switch (req.method) {
      case 'GET':
         return refreshToken()
         
      default:
         return res.status(400).send('No method provider')
    }

    async function refreshToken() {
        const refreshToken = getCookie(req, 'next-refresh-token')
        const rememberMeToken = getCookie(req, 'next-remember-me-token')

        if(!refreshToken && !rememberMeToken) return res.status(404).setHeader('Set-Cookie', [
            serialize('next-token', '', {
              maxAge: -1,
              path: '/',
            }),
            serialize('next-refresh-token', '', {
              maxAge: -1,
              path: '/',
            }),
          ]).send('No refresh-token provided')
        
        if(refreshToken) {
          console.log(rememberMeToken)
          const payload:any = jwt.decode(refreshToken)
          if(!payload) return res.status(400).send('Token inválido')
          
          const token = jwt.sign({ data: payload.data }, `${process.env.JWT_SECRET}`, {expiresIn: '5mins'})
          
          return res
          .setHeader('Set-Cookie',
              serialize('next-token', token, {path: '/' })
          ).send('Login feito com sucesso')
        }
        else if (rememberMeToken) {
          const payload:any = jwt.decode(rememberMeToken)
          if(!payload) return res.status(400).send('Token inválido')
          
          const storageRememberMeToken = await prisma.remember_me_token.findFirst({ where:{ user_id: payload.data.user.id } })

          if(!storageRememberMeToken) return res.status(400).send('Sem token de revalidação armazenado')

          const storagePayload: any = jwt.decode(storageRememberMeToken.token)

          if(!storagePayload) return res.status(400).send('Token inválido')


          if(storagePayload.data.origin !== payload.data.origin) 
            return res.status(400)
              .setHeader('Set-Cookie', 
                serialize('next-remember-me-token', '', {
                  maxAge: -1,
                  path: '/',
                }),).send('Sua sessão expirou')

          
          const token = jwt.sign({ data: payload.data }, `${process.env.JWT_SECRET}`, {expiresIn: '5mins'})
          const refreshToken = jwt.sign({ data: payload.data }, `${process.env.JWT_SECRET}`, {expiresIn: '60mins'})
          const expiresRefreshToken = new Date(new Date().setMinutes(new Date().getMinutes() + 15 * 2))
          
          return res
          .setHeader('Set-Cookie',
            [serialize('next-token', token, {path: '/' }),
            serialize('next-refresh-token', refreshToken, {path: '/', expires: expiresRefreshToken, httpOnly: true }),]
          ).send('Login feito com sucesso')
        }
    }

}

export default handler