import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../utils/database';

function handler(req: NextApiRequest, res: NextApiResponse ){

   switch (req.method) {
        case 'GET':
        return  getPermissionById()

        default:
        return res.status(400).send('No method provider')
    }

    async function getPermissionById(){
        const {id}: any = req.query

        const result = await prisma.group_permission.findMany({ where: {group_id: parseInt(id) }, include: {application: true} })
        const response: any = []
        result.forEach( item => {
          if(item.application){
            response.push(item.application)
          }
        })
        return res.status(200).send(result  )


    } 

  }

export default handler