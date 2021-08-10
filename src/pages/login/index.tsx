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


    const authCookies = serialize('next-token', newToken, {path: '/' })
    const header = {'Location': '/','Set-Cookie': authCookies   }   
    ctx.res.writeHead(302, header).end()

    return {
        props: {}
    }
}