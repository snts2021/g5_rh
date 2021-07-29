import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/database";
import { serialize } from 'cookie'

import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {

    const hashedPassword = await new Promise( (resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) reject(err)
        resolve(hash)
      })
    })
    return hashedPassword
  }
  
  export const comparePassword = async (password: string, storagePassword: string) => {
    const result = await new Promise( (resolve, reject) => {
        bcrypt.compare(password, storagePassword, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
    })
  
    return result
  }

  export const valideJwt = async (token: string) => {
    const result = await new Promise( (resolve, reject) => {
      jwt.verify(token, `${process.env.JWT_SECRET}`, (err, result) => {
        if (err) reject(err)
        resolve(result)
      })
    })
    
    return result
  }

async function handler(req: NextApiRequest, res: NextApiResponse ){
    
    const { login, password } = req.body

    const user = await prisma.users.findFirst({ where: { login }, include: {group: true}})
    await prisma.$disconnect()
    if(!user) return res.status(404).send('Usuário não encontrado')
    const isPasswordCorret = await comparePassword(password, `${user.password}`)
    if(!isPasswordCorret) return res.status(400).send('Senha incorreta')
    
    const formattedUser = {
        id: user.id,
        name: user.name,
        group: {
            id: user.group_id,
            name: user.group.name
        }
    }
    
    const token = jwt.sign({ user: formattedUser }, `${process.env.JWT_SECRET}`, {expiresIn: '5mins'})
    const refreshToken = jwt.sign({ user: formattedUser }, `${process.env.JWT_SECRET}`, {expiresIn: '60mins'})
    
    const expiresRefreshToken = new Date(new Date().setMinutes(new Date().getMinutes() + 15 * 2))
    return res
    .setHeader('Set-Cookie', [
        serialize('next-token', token, {path: '/' }),
        serialize('next-refresh-token', refreshToken, {path: '/', expires: expiresRefreshToken, httpOnly: true })
    ]
    )
    .send('Login feito com sucesso')
    
}

export default handler