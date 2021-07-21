import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { prisma } from '../../../services/database'
import multer from '../../../utils/multer'

import nextConnect from 'next-connect'

type Data = {
    dados?: any[]
}
interface iProps extends NextApiRequest {
    file: {
        location: string
    }
}
const handler = nextConnect<iProps, NextApiResponse>()
    .use(multer.single('file'))
    .post( async ( req, res) => {
        const { descricao_chamado } = req.body
        // console.log()
        // const user = await prisma.users.findFirst({ where: {id: userData.user.id }})
        const result = await prisma.rh_app_chamados.create({ 
            data: {descricao_chamado, status_chamado: 'ABERTO', anexo_chamado: req.file.location}
        })
        
        await prisma.$disconnect()
        return res.status(200).send({ result: result })

    })
    .get( async ( req, res) => {
        const dados = await prisma.rh_app_chamados.findMany()
        prisma.$disconnect()
        res.send({dados})
    }
)

export const config = {
    api: {
        bodyParser: false
    }
  }


export default handler
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {

//     switch (req.method) {
//         case 'GET':
//             return pegarTodosOsDados()    
//         case 'PUT':
//             return atualizarRegistro()
//         case 'POST':
//             return inserirRegistro()
//         default:
//             break;
//     }

//     async function pegarTodosOsDados(){
    
      
//     }

//     async function atualizarRegistro(){    
//         const {item} = req.body
           
//         const newItem = { ...item }
//         delete newItem.id_rh_app_chamados
        
//         console.log(newItem)

//         const result = await prisma.rh_app_chamados.update({ 
//             data: newItem,
//             where: {id_rh_app_chamados:  parseInt(item.id_rh_app_chamados) 
//             } 
//         })
//         // await prisma.navio_cadastro_ship.create({data:{ nome_navio: item.nome_navio }})
//         prisma.$disconnect()
//         return res.status(200).send({ result: result || '' })
//     }

//     async function inserirRegistro(){   
        

//         const userData: any = await getSession({ req })
        
//         const {item} = req.body
           
//         const {descricao_chamado} = item
        
//         const user = await prisma.users.findFirst({ where: {id: userData.user.id }})
//         const result = await prisma.rh_app_chamados.create({ 
//             data: {descricao_chamado, colaborador: user?.nome, status_chamado: 'ABERTO'}
//         })
//         // await prisma.navio_cadastro_ship.create({data:{ nome_navio: item.nome_navio }})
        
//         await prisma.$disconnect()
//         return res.status(200).send({ result: result || '' })
//     }

// }
