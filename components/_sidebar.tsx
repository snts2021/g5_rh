import { Box, Collapse, Drawer, Fab, IconButton, List, ListItem, Typography } from "@material-ui/core"
import { MdAddCircle, MdAttachMoney, MdExitToApp, MdExpandLess, MdExpandMore, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdPerson } from 'react-icons/md'
import { signOut } from 'next-auth/client'
import { useRouter } from "next/router"
import { useState } from "react"

const Sidebar = ({ drawerOpen, setDrawerOpen }: any) => {

    const router = useRouter()
    const [chamadosSubmenu, setchamadosSubmenu] = useState(false)

    return (
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
                       {/* BOTÃO PRINCIPAL DE CHAMADOS */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <ListItem 
                                onClick={() => {router.push(''); setDrawerOpen(!drawerOpen)}}
                                sx={{ 
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: 'fit-content',
                                    gap: 1,
                                    color: 'white' }}>
                                <IconButton sx={{color: 'white'}} >
                                    <MdAddCircle />
                                </IconButton>
                                <Typography component="p" variant="subtitle2">
                                    Chamados
                                </Typography>
                            </ListItem>
                            <Box sx={{ paddingRight: 1 }} >
                                <IconButton sx={{ color: 'white'}} onClick={() => setchamadosSubmenu(!chamadosSubmenu)}>
                                    {
                                        chamadosSubmenu ?
                                        <MdExpandLess /> :
                                        <MdExpandMore /> 
                                    }
                                </IconButton>
                            </Box>
                        </Box>
                        {/* SUB MENU */}
                        <Collapse in={chamadosSubmenu}>
                            <List sx={{ paddingY: 0}}>
                                <ListItem sx={{ paddingLeft: 8, color: 'white'}} button onClick={() => {router.push('/chamados'); setDrawerOpen(!drawerOpen)}}>
                                    <Typography component="p" variant="subtitle2">
                                        Consultar Chamados
                                    </Typography>
                                </ListItem >
                                <ListItem sx={{ paddingLeft: 8, color: 'white'}} button onClick={() => {router.push('/tipo_chamados_cadastro'); setDrawerOpen(!drawerOpen)}}> 
                                    <Typography component="p" variant="subtitle2">
                                        Cadastrar Tipo de Chamado
                                    </Typography>
                                </ListItem>
                            </List>
                        </Collapse>
                        {/* --------------- */}
                    
                    {/* --------------------------------- */}
                    </List>
                    
                </List>
                <ListItem onClick={() => signOut()} button sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
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
    )
}

export {Sidebar}