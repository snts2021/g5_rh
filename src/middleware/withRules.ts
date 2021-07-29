import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../utils/database"
import { getSession } from "./auth"

async function getRules(req, user){
    let path = req.url.split('/')
    path = `/${path[path.length - 1]}`
    const rules = await prisma.group_permission.findFirst({ where: {group_id: user.group.id, AND: { group_id: user.group.id} }})
    return rules
}



const withRules = (handler: any) => { 
    return async (req: NextApiRequest, res: NextApiResponse) => {
        
        const session = await getSession(req)
        if(!session) return res.status(401).send('Não foi possível validar o seu usuário')

        const rules = await getRules(req, session.user)
        if(!rules) return res.status(500).send('Erro ao verificar permissões')
        
        switch (req.method) {
            case 'GET':
                if (!rules.canView) return res.status(403).send('Você não tem permissão para vizualização')               
                break;
            case 'PUT':
                if (!rules.canUpdate) return res.status(403).send('Você não tem permissão para edição')               
                break;
            case 'POST':
                if (!rules.canInsert) return res.status(403).send('Você não tem permissão para inserção')               
                break;
            case 'DELETE':
                if (!rules.canDelete) return res.status(403).send('Você não tem permissão para deletar')               
                break;
        }

        return handler(req, res)
    }
}

export { withRules }