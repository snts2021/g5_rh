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
    
      const dados = await prisma.rh_web_chamados_tipo_cadastro.findMany()
      prisma.$disconnect()
      return res.status(200).send({dados})
    }

    async function atualizarRegistro(){    
        const {item} = req.body
           
        const {tipo_chamado} = item
        
        const result = await prisma.rh_web_chamados_tipo_cadastro.update({ 
            data: {tipo_chamado}, 
            where: {id_rh_web_chamados_tipo_cadastro:  parseInt(item.id_rh_web_chamados_tipo_cadastro) 
            } 
        })
        // await prisma.navio_cadastro_ship.create({data:{ nome_navio: item.nome_navio }})
        prisma.$disconnect()
        return res.status(200).send({ result: result || '' })
    }

    async function inserirRegistro(){    
        const {item} = req.body
           
        const {tipo_chamado} = item
        
        const result = await prisma.rh_web_chamados_tipo_cadastro.create({ 
            data: {tipo_chamado:tipo_chamado}
        })
        // await prisma.navio_cadastro_ship.create({data:{ nome_navio: item.nome_navio }})
        prisma.$disconnect()
        return res.status(200).send({ result: result || '' })
    }

}
