import { NextApiRequest, NextApiResponse } from 'next';
import { withRules } from '../../../middleware/withRules';
import { prisma } from '../../../utils/database';

function handler(req: NextApiRequest, res: NextApiResponse ){
   
   switch (req.method) {
      case 'GET':
      return getAllGroups()
      case 'POST':
      return createGroup()
      case 'PUT':
      return
      case 'DELETE':
      return
      
      default:
      return res.status(400).send('No method provider')
   }
   
   async function getAllGroups() {
      console.log(process.env.MODULE )
      const groups = await prisma.groups.findMany({ where: {modules: { name: process.env.MODULE }, AND: { NOT: { name: "super" } } }  })
      console.log(groups)
      
      return res.status(200).send(groups)
   }
   
   async function createGroup() {
      const { name } = req.body
      
      if(!name) return res.status(400).send('Formato inválido')
      const {id}: any = await prisma.modules.findFirst({ where: {name: `${process.env.MODULE}`}})
      if(!id) return res.status(400).send('Não foi possível verificar seu módulo')
      
      const newGroup = await prisma.groups.create({ data: { module_id: id, name }})
      
      await prisma.$disconnect()
      return res.status(200).send({newGroup})   
   }
   
}

export default  withRules(handler)