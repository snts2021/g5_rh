import jwt from 'jsonwebtoken'
import { NextApiRequest } from 'next'
import { valideJwt } from '../pages/api/auth/login'

export function getCookie(req: NextApiRequest, name: string){
    if(!req.headers.cookie) return null
    const cookies = req.headers.cookie.split('; ') 

    for(let x in cookies){
        if(cookies[x].includes(name))
            return cookies[x].split('=')[1]
    }
}

type IgetSessionResponse = {
    user : {
        id: number
        name: string
        group: {
            id: number
            name: string
        }
    }
}

export async function getSession(req: NextApiRequest): Promise<IgetSessionResponse | null>  {
    const token = getCookie(req, 'next-token')
    if(!token) return null
        
        
    try {
        await valideJwt(token)
        const payload: any = jwt.decode(token)
    
        if(!payload) return null
    
        return payload
    } catch (error) {
        return null
    }

}