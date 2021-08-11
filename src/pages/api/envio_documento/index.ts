import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../utils/database'

import multer, { s3 } from '../../../utils/multer'
import nextConnect from 'next-connect'
import { withRules } from '../../../middleware/withRules'

type Data = {
    dados?: any[]
}


interface iProps extends NextApiRequest {
    file: {
        location: string
    }
}

const handler = nextConnect<iProps, NextApiResponse>()
    .use(multer.single('envio_documento'))

    .get(
        async ( req, res) => {
            const dados = await prisma.rh_app_documentos.findMany()
            prisma.$disconnect()
            return res.status(200).send({dados}) 
        })

    .put(
        async ( req, res) => {
            console.log('teste')
            const {id_rh_app_documentos}:any = req.query
            const {descricao} = req.body

            
            const documento = await prisma.rh_app_documentos.findUnique({where:{id_rh_app_documentos:parseInt(id_rh_app_documentos)}})

            if(req.file){
                const nome_arquivo = documento?.arquivo?.split('/').pop()
                s3.deleteObject({Bucket:'sistemag5', Key: `${nome_arquivo}`},(error,data)=>{})
                const result = await prisma.rh_app_documentos.update({ 
                    data: {descricao,arquivo:req.file.location}, 
                    where: {id_rh_app_documentos:  parseInt(id_rh_app_documentos) 
                    } 
                })
                prisma.$disconnect()
                return res.status(200).send({ result: result || '' })
            }else{
                const result = await prisma.rh_app_documentos.update({ 
                    data: {descricao}, 
                    where: {id_rh_app_documentos:  parseInt(id_rh_app_documentos) 
                    } 
                })
                prisma.$disconnect()
                return res.status(200).send(result)
            }
                

            // await prisma.navio_cadastro_ship.create({data:{ nome_navio: item.nome_navio }})
        })

    .post( 
        async ( req, res) => {
        const {descricao} = req.body
        console.log(req.file)
        const result = await prisma.rh_app_documentos.create({ 
            data: {
                descricao:descricao,
                arquivo:req.file.location
            }
        })
        // await prisma.navio_cadastro_ship.create({data:{ nome_navio: item.nome_navio }})
        prisma.$disconnect()
        return res.status(200).send({ result: result || '' })
    })

    export const config = {
        api: {
            bodyParser: false
        }
      }

export default withRules(handler)