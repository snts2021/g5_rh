import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { prisma } from '../../../services/database'

type Data = {
    dados?: any[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    switch (req.method) {
        case 'GET':
            return pegarTodosOsDados()    
        case 'PUT':
            return atualizarRegistro()
        case 'POST':
            return inserirRegistro()
        default:
            break;
    }

    async function pegarTodosOsDados(){
    
      const dados = await prisma.rh_app_chamados.findMany()
      prisma.$disconnect()
      return res.status(200).send({dados})
    }

    async function atualizarRegistro(){    
        const {item} = req.body
           
        const newItem = { ...item }
        delete newItem.id_rh_app_chamados
        
        console.log(newItem)

        const result = await prisma.rh_app_chamados.update({ 
            data: newItem,
            where: {id_rh_app_chamados:  parseInt(item.id_rh_app_chamados) 
            } 
        })
        // await prisma.navio_cadastro_ship.create({data:{ nome_navio: item.nome_navio }})
        prisma.$disconnect()
        return res.status(200).send({ result: result || '' })
    }

    async function inserirRegistro(){   
        

        const userData: any = await getSession({ req })
        
        const {item} = req.body
           
        const {descricao_chamado} = item
        
        const user = await prisma.users.findFirst({ where: {id: userData.user.id }})
        const result = await prisma.rh_app_chamados.create({ 
            data: {descricao_chamado, colaborador: user?.nome, status_chamado: 'ABERTO'}
        })
        // await prisma.navio_cadastro_ship.create({data:{ nome_navio: item.nome_navio }})
        
        await prisma.$disconnect()
        return res.status(200).send({ result: result || '' })
    }

}
