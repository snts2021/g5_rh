import { createContext, useEffect, useState } from "react";
import { parseCookies } from 'nookies'
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import { Backdrop, Box, CircularProgress, CssBaseline } from "@material-ui/core";

type iGroup = {
    group: {
        id: number
        name: string 
        module_id: number
    }
    group_id: number
}

type iUser = {
    user: {
        id: number
        name: string
        role: string
        login: string
    }
    groups: iGroup[]
}

type iAuthProps = {
    isAuthenticated: boolean
    user: iUser | null
    SignOut(): void
}

export const AuthContext = createContext({} as iAuthProps)

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null)
    const router = useRouter()

    async function SignOut(){
        await api.get('/auth/logout')
        router.push('/')
    }

    useEffect(() => {
        api.interceptors.response.use( response => response, async (error) => {
            if(error.response.status === 401) {
                
                const { config } = error
                config._retryCount = config._retryCount || 0
                if(config._retryCount >= 2) return error
                config._retryCount +=1
    
                try {
                    await api.get('/auth/refreshToken')

                    const defaultResponse = await api(config)
                    
                    return defaultResponse
                } catch (error) {
                    if(error.response.data === "No refresh-token provided") await SignOut()
                    return Promise.reject(error)
                }
            }
            return Promise.reject(error)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])
    
    async function getRememberMeToken(){
        try {
            await api.get('/auth/refreshToken')
            router.reload()
        } catch (error) {
            console.log(error.response.data)
            await SignOut()
        }
    }

    useEffect(() => {
        const cookies = parseCookies()
        const token = cookies['next-token']
        const decodedToken: any = jwt.decode(token)
        
        if(!decodedToken) {
            const rememberMeToken = cookies['next-remember-me-token']
            const decodedRememberMeToken: any = jwt.decode(rememberMeToken)
            if(decodedRememberMeToken){
               getRememberMeToken()
            }else {
                router.push('/')
            }
        }

        if(decodedToken) {
            const user = decodedToken.data
            setUser(user)

        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, SignOut }}>
            {
                !user ? <Loading />
                : <>{children}</>
            }
        </AuthContext.Provider>
    )
}



function Loading() {
    return(
        <>
            <CssBaseline/>
            <Box sx={{ 
                backgroundColor: '#fff',
                color: 'black', 
                width: '100vw', 
                height: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center'
            }}>
                <CircularProgress color="inherit" />
            </Box>
        </>
    )
}