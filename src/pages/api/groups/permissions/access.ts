import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../utils/database';

function handler(req: NextApiRequest, res: NextApiResponse ){

   switch (req.method) {
      case 'PUT':
        return updateGroupAccess() 

      default:
        return res.status(400).send('No method provider')
    }

    async function updateGroupAccess(){
        const { id }:any = req.query
        const {data} = req.body

        const result = await prisma.group_permission.update({ data , where: { id: parseInt(id)}})
        
        return res.status(200).send(result)
    }

  }

export default handler