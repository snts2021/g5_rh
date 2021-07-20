import type { NextApiRequest, NextApiResponse } from 'next'
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
    
      const dados = await prisma.users.findMany()
      prisma.$disconnect()
      return res.status(200).send({dados})
    }

    async function atualizarRegistro(){    
        const {item} = req.body
           
        const {nome} = item //PAROU
        
        const result = await prisma.users.update({ 
            data: {nome}, 
            where: {users:  parseInt(item.users)
            } 
        })
        // await prisma.navio_cadastro_ship.create({data:{ nome_navio: item.nome_navio }})
        prisma.$disconnect()
        return res.status(200).send({ result: result || '' })
    }

    async function inserirRegistro(){    
        const {item} = req.body
           
        const {nome} = item
        
        const result = await prisma.users.create({ 
            data: {nome}
        })
        // await prisma.navio_cadastro_ship.create({data:{ nome_navio: item.nome_navio }})
        prisma.$disconnect()
        return res.status(200).send({ result: result || '' })
    }

}
