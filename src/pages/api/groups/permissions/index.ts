import { NextApiRequest, NextApiResponse } from 'next';
import { withRules } from '../../../../middleware/withRules';
import { prisma } from '../../../../utils/database';

function handler(req: NextApiRequest, res: NextApiResponse ){
  
  switch (req.method) {
    //   case 'GET':
    //      return
    //   case 'POST':
    //      return
    case 'PUT':
    return UpdatePermissions()
    //   case 'DELETE':
    //      return
    
    default:
    return res.status(400).send('No method provider')
  }
  
  async function UpdatePermissions(){
    const { group_id }:any= req.query
    const { add, remove } = req.body
    
    const groups = await prisma.groups.findUnique({ include: {permissions: true}, where: {id:parseInt(group_id)}})
    
    if(!groups) return res.status(404).send('grupo não encontrado')

    const { permissions } = groups

    const formattedAdd = add.slice(0)
    permissions.forEach( item => {
      if(formattedAdd.includes(item.application_id)){
        formattedAdd.splice(formattedAdd.indexOf(item.application_id), 1)
      }
    })

    for(let x = 0; x < formattedAdd.length; x++) {
        await prisma.group_permission.create({
          data: {
            canDelete: false,
            canInsert: false,
            canUpdate: false,
            canView: false,
            application_id: formattedAdd[x],
            group_id: parseInt(group_id)
          }
        })
    }

    const formattedRemove = remove.slice(0)

    permissions.forEach( item => {
      if(!formattedRemove.includes(item.application_id)) {
        formattedRemove.slice(formattedRemove.indexOf(item.application_id), 1)
      }
    })
    
    for(let x =0; x < formattedRemove.length; x++) {
      await prisma.group_permission.deleteMany( {where: { group_id: parseInt(group_id), AND: {application_id: remove[x] } }})
    }
    

    return res.status(200).send('ok')
  }
  
}

export default withRules(handler)