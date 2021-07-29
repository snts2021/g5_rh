import { NextApiRequest, NextApiResponse } from 'next';
import { withRules } from '../../middleware/withRules';
import { prisma } from '../../utils/database';
import { hashPassword } from './auth/login';

function handler(req: NextApiRequest, res: NextApiResponse ){
   
   switch (req.method) {
      case 'GET':
      return getAllUser()
      case 'POST':
      return createUser()
      case 'PUT':
      return
      case 'DELETE':
      return
      
      default:
      return res.status(400).send('No method provider')
   }
   
   async function getAllUser(){
      const users = await prisma.users.findMany({ include: {group: true}})
      await prisma.$disconnect()
      return res.status(200).send(users)
   }
   
   async function createUser(){
      const { user } = req.body

      if(!user) return res.status(400).send('Usuário não enviado')
      
      user.password = await hashPassword(user.password)
      const newUser = await prisma.users.create({ data: {...user, group_id: 1} })
      await prisma.$disconnect()
      return res.status(200).send(newUser)
   }
   
}

export default handler 