import { NextApiRequest, NextApiResponse } from 'next';
import { withRules } from '../../../middleware/withRules';
import { prisma } from '../../../utils/database';
import { hashPassword } from '../auth/login';

function handler(req: NextApiRequest, res: NextApiResponse ){
   
   switch (req.method) {
      case 'GET':
      return getAllUser()
      case 'POST':
      return createUser()
      case 'PUT':
      return updateUser()
      case 'DELETE':
      return deleteUser()
      
      default:
      return res.status(400).send('No method provider')
   }
   
   async function getAllUser(){


      const users = await prisma.users.findMany({ 
         select: {
            id: true, 
            login: true, 
            name: true, 
            groups: {
               select: {
                  group: true
               }
            }
         }
      })

      console.log(users, process.env.MODULE)

      await prisma.$disconnect()
      return res.status(200).send(users)
   }
   
   async function createUser(){
      const { user } = req.body

      if(!user) return res.status(400).send('Usuário não enviado')
      
      user.password = await hashPassword(user.password)
      const newUser = await prisma.users.create({ data: {...user} })
      await prisma.users_groups.create({ data: { group_id: 1, user_id: newUser.id} })
      await prisma.$disconnect()
      return res.status(200).send(newUser)
   }

   async function updateUser() {
      const { login }:any = req.query
      const { user } = req.body

      if(!user) return res.status(400).send('Usuário não enviado')
      const newUser = await prisma.users.update({ data: { ...user }, where: { login } })
      await prisma.$disconnect()

      return res.status(200).send(newUser)
   }

   async function deleteUser() {
      const { id }: any = req.query

      if(!id) return res.status(400).send('email do usuário não enviado')

      await prisma.users.delete({ where: { id }, include: { groups: true } })
      await prisma.$disconnect()
      return res.status(200).send('Usuário deletado com sucesso')
   }
   
}

export default handler 
