import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/database';

function handler(req: NextApiRequest, res: NextApiResponse ){

   switch (req.method) {
      case 'PUT':
         return updateUseGroup()
      default:
         return res.status(400).send('No method provider')
    }

    async function updateUseGroup(){
        const { user_id }:any = req.query
        const { add, remove } = req.body

        const user_groups = await prisma.users_groups.findMany({ where: { user_id: parseInt(user_id) } })

        // console.log(user_groups, add, remove)

        const formattedAdd = add.slice(0)
        user_groups.forEach( item => {
            if(formattedAdd.includes(item.group_id)) {
                formattedAdd.splice(formattedAdd.indexOf(item.group_id), 1)
            }
        })

        for(let x = 0; x < formattedAdd.length; x++) {
            await prisma.users_groups.create({
              data: {
                user_id: parseInt(user_id),
                group_id: parseInt(formattedAdd[x])
              }
            })
        }

        const formattedRemove = remove.slice(0)

        user_groups.forEach( item => {
            if(!formattedRemove.includes(item.group_id)) {
              formattedRemove.slice(formattedRemove.indexOf(item.group_id), 1)
            }
          })
          
        for(let x =0; x < formattedRemove.length; x++) {
            await prisma.users_groups.deleteMany( {where: { group_id: parseInt(formattedRemove[x]), AND: { user_id: parseInt(user_id) } }})
        }

        return res.status(200).send('ok')

    }

  }

export default handler