import { serialize } from "cookie"
import { valideJwt } from "../api/auth/login"
import jwt from "jsonwebtoken";

export default function AutoLogin(){
    return(
        <>
        </>
    )
}

export async function getServerSideProps(ctx){

    const { token } = ctx.query

    const decodedToken:any = await valideJwt(token)
    
    const newToken = jwt.sign({data: decodedToken}, `${process.env.JWT_SECRET}`, { expiresIn: '6mins'})
    const refreshToken = jwt.sign({ data: decodedToken }, `${process.env.JWT_SECRET}`, {expiresIn: '60mins'})
    // const rememberMeToken = jwt.sign({ data: {...decodedToken, origin: ctx.req.headers.origin } }, `${process.env.JWT_SECRET}`, {expiresIn: '7days'})

    const authCookies = serialize('next-token', newToken, {path: '/' })
    const authCookies2 = serialize('next-refresh-token', refreshToken, {path: '/' })
    const header = {'Location': '/','Set-Cookie': `${authCookies2};${authCookies}`   }   
    ctx.res.writeHead(302, header).end()

    return {
        props: {}
    }
}