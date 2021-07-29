import { Box, Collapse, Drawer, Fab, IconButton, List, ListItem, Typography } from "@material-ui/core"
import { MdAddCircle, MdAttachMoney, MdExitToApp, MdExpandLess, MdExpandMore, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdPerson } from 'react-icons/md'
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { AuthContext } from "../contexts/auth"

const Sidebar = ({ drawerOpen, setDrawerOpen }: any) => {

    const router = useRouter()
    const { SignOut } = useContext(AuthContext)
    const [chamadosSubmenu, setchamadosSubmenu] = useState(false)

    return (
        <>
         {
            drawerOpen &&
            <Box sx={{ position: 'fixed', width: '100%', height: '100%', backgroundColor: 'black', opacity: '30%', zIndex: 9}} onClick={() => setDrawerOpen(false)} />
        }
        <Box sx={{ display: 'flex', position: 'fixed', zIndex: 10, width: 'fit-content' }}>
            <Drawer
                sx={{
                    width: 72,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 230,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
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
                    <ListItem button sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
                        <IconButton sx={{color: 'white'}} >
                            <MdPerson />
                        </IconButton>
                        <Typography component="p" variant="subtitle2" >
                            Usuários
                        </Typography>
                    </ListItem>
                    <List sx={{ marginTop: 2}}>
                    {/* ADICIONAR NOVOS ELEMENTOS NO MENU */}
                        <SideMenuItem 
                            setDrawerOpen={setDrawerOpen}
                            title="Chamados" 
                            icon={<MdAddCircle />} 
                            submenu={[
                                { to: '/chamados', title: 'Consultar Chamados'}, 
                                { to: '/tipo_chamados_cadastro', title: ' Cadastrar Tipo de Chamado'},
                            ]
                        }
                        />
                       {/* BOTÃO PRINCIPAL DE CHAMADOS */}
                    
                        {/* --------------- */}
                    
                    {/* --------------------------------- */}
                    </List>
                    
                </List>
                <ListItem onClick={() => SignOut()} button sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
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
                position: 'absolute', 
                transition: 'all ease 200ms',
                right: `${drawerOpen ? '-190px' : '40px'}`, 
                top: 60, 
                zIndex: 999999, 
                backgroundColor: 'background.default', 
                borderRadius: '100%', 
                padding: 1 }}>
                <Fab size="small" sx={{fontSize: '30px'}} color="primary"  onClick={() => setDrawerOpen(!drawerOpen)} >
                    {
                        !drawerOpen ?
                        <MdKeyboardArrowRight/>
                        :
                        <MdKeyboardArrowLeft />
                    }
                </Fab>
            </Box>
        </Box>
        </>
    )
}

export {Sidebar}


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