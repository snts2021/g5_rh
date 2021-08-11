import { AppBar, Box, Breadcrumbs, CssBaseline, Toolbar, Typography, useMediaQuery } from "@material-ui/core"
import Link from "next/link"
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"
import { Sidebar } from "./_sidebar"



export const TopBar = () => {
    const mobile=useMediaQuery('(max-width:500px)')
    
    const breadcrumbsMaps = {
        '/custos': 'Custo Geral!',
        '/security': 'Segurança',
        '/users': 'Usuários',
        '/groups': 'Grupos',
        '/chamados': 'Chamados',
        '/envio_documento': 'Envio documento',
        '/tipo_chamados_cadastro': 'Cadastrar de Tipo de Chamado',
        // '/taxa-salario': 'Salário',
    }
    const [path, setPath] = useState<any[]>([])
    const router = useRouter()
    const [drawerOpen, setDrawerOpen] = useState(false)

    useEffect(() => {
        const newPath:any[] = router.pathname.slice(0).split('/').filter((x) => x)
        setPath(newPath)
    }, [router])

    return (
    <>
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    display: (drawerOpen && mobile) ? 'none' : 'initial',
                    transition: 'all ease 200ms',
                    width: { sm: `calc(100% - ${drawerOpen ? '230px' : '0px'})`},
                    backgroundColor: 'white',
                    color: 'GrayText'
                }}
            >
                <Toolbar variant="dense" >
                    <Breadcrumbs>
                    {
                        path.map( (value, index) => {
                            const last = index === path.length - 1
                            const to = `/${value}`
                            if(last) 
                                return (
                                    <Typography key={index} color="MenuText" fontWeight="bold" variant="subtitle2">
                                        {breadcrumbsMaps[to] }
                                    </Typography>
                                )
                                return(
                                    <Link key={index} href={to}>
                                        <a>
                                        <Typography color="GrayText" sx={{ textDecoration: 'none'}} variant="subtitle2">
                                            {breadcrumbsMaps[to] }
                                        </Typography>
                                        </a>
                                    </Link>
                                )
                        })
                        }
                    </Breadcrumbs>
                </Toolbar>
            </AppBar>
        </Box>
        <Sidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
    </>
    )
}