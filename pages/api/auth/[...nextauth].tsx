import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import bcrypt from 'bcrypt'
import { prisma } from '../../../services/database'


export const hashPassword = async (password: string) => {

  const hashedPassword = await new Promise( (resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) reject(err)
      resolve(hash)
    })
  })
  return hashedPassword
}

export const comparePassword = async (password: string, storagePassword: string) => {
  const result = await new Promise( (resolve, reject) => {
      bcrypt.compare(password, storagePassword, (err, result) => {
        if (err) reject(err)
        resolve(result)
      })
  })

  return result
}

export default NextAuth({
  providers: [
    Providers.Credentials({
      
      name: 'Custom provider',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "teste" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const { login, password } = req.body
        const storageUser = await prisma.users.findFirst({ where: {login} })
        console.log(storageUser)
        await prisma.$disconnect()
        if(!storageUser) return null
        
        const result = await comparePassword(password, storageUser.password)

        if(!result) return null
        

        return { id: storageUser.id }  
        }
      }
    )
  ],
  session:{
    
    jwt: true
  },
  pages:{
    'signIn': '/',
    'error': '/'
  },
  callbacks: {
    signIn(user, account, profile) {
      return true
    },
    jwt: async (token, user, account, profile, isNewUser) => {
      //  "user" parameter is the object received from "authorize"
      //  "token" is being send below to "session" callback...
      //  ...so we set "user" param of "token" to object from "authorize"...
      //  ...and return it...
      user && (token.user = user);
      return Promise.resolve(token)   // ...here
  },
    session(session:any, token){
      //  "session" is current session object
      //  below we set "user" param of "session" to value received from "jwt" callback
      session.user = token.user
      return Promise.resolve(session)
  },
    async redirect(url, baseUrl) {
      return url
    },
  }
})