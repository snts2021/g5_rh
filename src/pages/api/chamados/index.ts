import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../utils/database'
import multer from '../../../utils/multer'
import nextConnect from 'next-connect'
import { getSession } from '../../../middleware/auth'


type Data = {
    dados?: any[]
}
interface iProps extends NextApiRequest {
    file: {
        location: string
    }
}
const handler = nextConnect<iProps, NextApiResponse>()
    .use(multer.single('anexo_chamado'))
    .post( async ( req, res) => {

        const session = await getSession(req)
        
        const {id_rh_app_chamados}:any = req.query
        const { descricao_chamado, tipo_chamado } = req.body
        
        const result = await prisma.rh_app_chamados.create({
            data:{
                descricao_chamado,
                status_chamado: 'ABERTO',
                anexo_chamado: req.file.location,
                colaborador: ' 123 ',
                tipo_chamado,
                data_abertura :new Date()
            }
        })
        
        await prisma.$disconnect()
        return res.status(200).send({ result: result })

    })
    .get( async ( req, res) => {
        const dados = await prisma.rh_app_chamados.findMany({orderBy: {status_chamado: 'asc'}})
        prisma.$disconnect()
        res.send({dados})
    })
    .put(async ( req, res) => {

        const session = await getSession(req)

        const {id_rh_app_chamados}:any = req.query
        const {status_chamado, descricao} = req.body
        // console.log(session)
        if(status_chamado === 'EM ANDAMENTO'){
            await prisma.rh_app_chamados.update({
                data:{
                    status_chamado, 
                    descricao_atendimento:descricao, 
                    usuario_atendimento:session?.data.user.name,
                    data_atendimento: new Date()
                }, 
                where:{
                    id_rh_app_chamados: parseInt(id_rh_app_chamados) 
                } 
            })
        }else if(status_chamado === 'FINALIZADO'){
            await prisma.rh_app_chamados.update({
                data:{
                    status_chamado, 
                    resposta_chamado:descricao,  
                    usuario_finalizado:session?.data.user.name,
                    data_finalizado: new Date()
                }, 
                where:{
                    id_rh_app_chamados: parseInt(id_rh_app_chamados)
                } 
            })
        }


        return res.send({ status_chamado, descricao })
    })
export const config = {
    api: {
        bodyParser: false
    }
  }


export default handler