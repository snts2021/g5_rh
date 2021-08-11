import { serialize } from "cookie"
import jwt from "jsonwebtoken"

export default function Page(){
    return (
        <></>
    )
}

 
export async function getServerSideProps(ctx) {
  
    if(process.env.ENVIRONMENT === "DEV") {
        const token = jwt.sign({ data: { user: {id: 1, name: 'dev', login: 'dev', role: 'dev'}, groups: [ {group: { id: 7, name: 'dev', module_id: 1 }} ] } }, `${process.env.JWT_SECRET}`, {expiresIn: '7days'})
    
        const authCookies = serialize('next-token', token, {path: '/' })
        const header = {'Location': '/','Set-Cookie': authCookies   }   
        ctx.res.writeHead(302, header).end()
    }

    return {
        props: {}
    }
  }