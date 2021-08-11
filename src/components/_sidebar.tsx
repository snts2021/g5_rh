import { Box, Button, Collapse, Drawer, Fab, IconButton, List, ListItem, Typography, useMediaQuery } from "@material-ui/core"
import { MdAddCircle, MdSecurity, MdAttachMoney, MdExitToApp, MdExpandLess, MdExpandMore, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdPerson, MdMenu, MdRecordVoiceOver, MdDescription, MdPeople } from 'react-icons/md'
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { AuthContext } from "../contexts/auth"

const Sidebar = ({ drawerOpen, setDrawerOpen }: any) => {

    const { SignOut } = useContext(AuthContext)
    const mobile=useMediaQuery('(max-width:500px)')

    const router = useRouter()

    async function handleNavigate(){
        router.push('http://localhost:3005')
    }

    return (
        <>
         {
            drawerOpen &&
            <Box sx={{ position: 'fixed', width: '100%', height: '100%', backgroundColor: 'black', opacity: '30%', zIndex: 9}} onClick={() => setDrawerOpen(false)} />
        }
        <Box sx={{ display: 'flex', position: 'fixed', zIndex: 10, width: 'fit-content' }}>
            <Drawer
                sx={{
                    width: mobile ? '100vw' : 72,
                    opacity: drawerOpen ? 1 : 0,
                    transition: 'all ease 200ms',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: mobile ? '100%' : 230,
                        border: 0,
                        top: 0,
                        boxSizing: 'border-box',
                        height: mobile ? 'calc( 100vh - 70px )' : '100vh'
                    },
                }}
                variant="persistent"
                anchor={ mobile ? "bottom" : 'left'}
                open={drawerOpen}
            >
                <List sx={{ 
                    paddingY: 2, 
                    backgroundColor: 'primary.main',
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%', 
                    justifyContent: 'space-between',
                }}>
                <List>
                    
                    <List sx={{ marginTop: 2}}>
                    {/* ADICIONAR NOVOS ELEMENTOS NO MENU */}
                        <SideMenuItem 
                            setDrawerOpen={setDrawerOpen}
                            title="Segurança"
                            icon={<MdSecurity />} 
                            submenu={[
                                { to: '/security/users', title: 'Usuários'}, 
                                { to: '/security/groups', title: 'Grupos'},
                            ]
                        }
                        />
                        <SideMenuItem 
                            setDrawerOpen={setDrawerOpen}
                            title="Chamados" 
                            icon={<MdRecordVoiceOver />} 
                            submenu={[
                                { to: '/chamados', title: 'Consultar Chamados'}, 
                                { to: '/tipo_chamados_cadastro', title: ' Cadastrar Tipo de Chamado'},
                            ]
                        }
                        />
                        <SideMenuItem 
                            setDrawerOpen={setDrawerOpen}
                            title="Documentos" 
                            icon={<MdDescription />} 
                            submenu={[
                                { to: '/envio_documento', title: 'Envio de Documento'}, 
                            ]
                        }
                        />
                    </List>
                    
                </List>
                <ListItem onClick={() => handleNavigate()} button sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
                        <IconButton sx={{color: 'white'}}>
                            <MdExitToApp />
                        </IconButton>
                        <Typography component="p" variant="subtitle2">
                            Sair
                        </Typography>
                </ListItem>
                </List>
            </Drawer>
            <Box sx={{ 
                display: !mobile? 'intial':'none',
                position: 'absolute', 
                transition: 'all ease 200ms',
                right: `${drawerOpen ? '-185px' : '50px'}`, 
                top: 60, 
                zIndex: 999999, 
                borderRadius: '100%' 
                }}>
                <Fab size="small" sx={{fontSize: '30px'}} color="default"  onClick={() => setDrawerOpen(!drawerOpen)} >
                    {
                        !drawerOpen ?
                        <MdKeyboardArrowRight/>
                        :
                        <MdKeyboardArrowLeft />
                    }
                </Fab>
            </Box>
        </Box>
        {
            mobile &&
            <MenuMobile setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen} />
        }
        </>
    )
}

export {Sidebar}

function MenuMobile({setDrawerOpen, drawerOpen}){

    const iconSize = 20

    return(
        <Box sx={{ zIndex: 100000, display: 'flex', justifyContent: 'space-between' , position: 'fixed', bottom:0, width: '100%', paddingX: 2, height:'70px', backgroundColor: 'white', borderTop: '1px solid #ddd'}}>
            {/* <MenuItemMobile to="/" setDrawerOpen={setDrawerOpen} icone={<MdPeople size={iconSize}/>} titulo='EM BREVE'/> */}
            <MenuItemMobile drawerOpen={drawerOpen} to="/chamados" setDrawerOpen={setDrawerOpen} icone={<MdRecordVoiceOver size={iconSize} />} titulo='CHAMADOS'/>
            <MenuItemMobile drawerOpen={drawerOpen} to="/envio_documento" setDrawerOpen={setDrawerOpen} icone={<MdDescription size={iconSize} />} titulo='DOCUMENTOS'/>
            <MenuItemMobile drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} icone={<MdMenu size={iconSize} />} titulo='MENU'/>
        </Box>
    )
}


type iPropsMenuItemMobile = {
    icone: any
    titulo: string
    to?: string 
    setDrawerOpen(value: boolean): void  
    drawerOpen?: any 
}

function MenuItemMobile({icone, titulo, to, setDrawerOpen, drawerOpen}: iPropsMenuItemMobile){

    const router = useRouter()

    function handleOpenMenu(){
        setDrawerOpen(!drawerOpen)
    }

    function handleNavigate(to: string) {
        router.push(to)
        setDrawerOpen(false)
    }

    return(
        <Button
        
            onClick={() => !to ? handleOpenMenu() : handleNavigate(to)}
            variant="text" 
            sx={{ 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}
        >
            <Box sx={{ color: "#3c3c3c" }}>
                {icone}
            </Box>
            <Typography color="#3c3c3c" variant="subtitle2" fontSize={12} fontWeight="bold">
                {titulo}
            </Typography>
        </Button>
    )
}






type ISubMenu = {
    to: string
    title: string
}

type iProps = {
    to?: string
    title: string
    icon: any
    submenu?: ISubMenu[]
    setDrawerOpen(value:boolean): void
}

const SideMenuItem = ({ to = "/", title, icon, submenu, setDrawerOpen }: iProps) => {
    
    const router = useRouter()

    const [menuState, setMenuState] = useState(false)


    function handleOpenMenu() {
        setMenuState(!menuState)
    }

    function handleNavigate(to: string) {
        router.push(to)
        setDrawerOpen(false)
    }

    return (
        <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <ListItem 
                onClick={() => submenu ? handleOpenMenu() : handleNavigate(to)}
                button 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    justifyContent: 'space-between',
                    color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton sx={{color: 'white'}} >
                        {icon}
                    </IconButton>
                    <Typography component="p" variant="subtitle2">
                        {title}
                    </Typography>
                </Box>
                {
                    submenu && (
                            <IconButton sx={{ color: 'white'}} >
                                {
                                    menuState ?
                                    <MdExpandLess /> :
                                    <MdExpandMore /> 
                                }
                            </IconButton>
                    )
                }
            </ListItem>
        </Box>
        {
            submenu && (
                <Collapse in={menuState}>
                    <List sx={{ paddingY: 0}}>
                        {
                            submenu.map( (item, index) => {
                                return (
                                    <ListItem key={index} sx={{ paddingLeft: 8, color: 'white'}} button onClick={() => handleNavigate(item.to)}>
                                        <Typography component="p" variant="subtitle2">
                                            {item.title}
                                        </Typography>
                                    </ListItem >
                                )
                            })
                        }
                    </List>
                </Collapse>
            )
        }
        </>
    )   

}