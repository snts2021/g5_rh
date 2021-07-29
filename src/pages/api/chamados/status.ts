import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/database";

async function handler(req: NextApiRequest, res: NextApiResponse){
    switch (req.method) {
        case 'PUT':
             AtualizarStatus()
            break;
    
        default:
            res.status(400).send('No method provided')
            break;
    }

    async function AtualizarStatus() {
        let {id_rh_app_chamados}:any = req.query
        id_rh_app_chamados = parseInt(id_rh_app_chamados)
        
        if(!id_rh_app_chamados) return res.status(400).send('Id do chamado não enviado')
        
        const chamado = await prisma.rh_app_chamados.findUnique({where:{id_rh_app_chamados}})
        if (!chamado) return res.status(404).send('Registro Não Encontrado')
        
        if (chamado.status_chamado === 'ABERTO'){
            const chamadoAtualizado = await prisma.rh_app_chamados.update({data:{ status_chamado: 'EM ANDAMENTO'},where:{id_rh_app_chamados}})
            return res.status(201).send({chamadoAtualizado})

        }else if (chamado.status_chamado === 'EM ANDAMENTO'){
            const chamadoAtualizado = await prisma.rh_app_chamados.update({data:{ status_chamado: 'FINALIZADO'},where:{id_rh_app_chamados}})
            return res.status(201).send({chamadoAtualizado})

        }else if (chamado.status_chamado === 'FINALIZADO'){
            const chamadoAtualizado = await prisma.rh_app_chamados.update({data:{ status_chamado: 'ABERTO'},where:{id_rh_app_chamados}})
            return res.status(201).send({chamadoAtualizado})
        } else{
            res.status(400).send('chamado não finalizado')
        }
    }
}

export default handler