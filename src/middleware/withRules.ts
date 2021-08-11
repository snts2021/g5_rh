import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../utils/database"
import { getSession } from "./auth"

async function getRules(req, user){
    let path = req.url.split('/')
    path = `/${path[path.length - 1]}`
    if(path.split('?').length > 1) path = path.split('?')[0]
    let rules = { canView: false, canUpdate: false, canDelete: false, canInsert: false }
    const idGroups: any = []
    user.groups.forEach( (item: any) => {
        idGroups.push(item.group.id)
        if(item.group.name === "super" || item.group.name === "dev") path = "*"
    })
    
    const groupsRules = await prisma.group_permission.findMany({ 
        where: {
            group_id: { in: [...idGroups] }, 
            AND: { 
                application: { url: path }
            } 
        }
    })

    await prisma.$disconnect()

    groupsRules.forEach(rule => {
        if(rule.canInsert) rules.canInsert = rule.canInsert  
        if(rule.canUpdate) rules.canUpdate = rule.canUpdate  
        if(rule.canDelete) rules.canDelete = rule.canDelete  
        if(rule.canView) rules.canView = rule.canView  
    })
    
    return rules
}

const withRules = (handler: any) => { 
    return async (req: NextApiRequest, res: NextApiResponse) => {
        
        const session = await getSession(req)
        if(!session?.data) return res.status(401).send('Não foi possível validar o seu usuário')
        const rules = await getRules(req, session.data)
        if(!rules) return res.status(500).send('Erro ao verificar permissões')

        switch (req.method) {
            case 'GET':
                if (!rules.canView) return res.status(403).send('Você não tem permissão para vizualização')
                await prisma.log.create({ data: {user: session.data.user.name, url: `${req.url}`, method: `${req.method}`, body: `Acesso` }})
                break;
            case 'PUT':
                if (!rules.canUpdate) return res.status(403).send('Você não tem permissão para edição')               
                await prisma.log.create({ data: {user: session.data.user.name, url: `${req.url}`, method: `${req.method}`, body: `${JSON.stringify(req.body)}` }})
                break;
            case 'POST':
                if (!rules.canInsert) return res.status(403).send('Você não tem permissão para inserção')               
                await prisma.log.create({ data: {user: session.data.user.name, url: `${req.url}`, method: `${req.method}`, body: `${JSON.stringify(req.body)}` }})
                break;
            case 'DELETE':
                if (!rules.canDelete) return res.status(403).send('Você não tem permissão para deletar')               
                break;
        }

        return handler(req, res)
    }
}

export { withRules }