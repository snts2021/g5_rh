import { Box, Button, Checkbox, Container, CssBaseline, IconButton, List, ListItem, MenuItem, Paper, Tooltip, Typography } from '@material-ui/core'
import { useContext, useEffect, useState } from 'react'
import { Grid, Header, Td, Tr } from '../../../components/_grid'
import { api } from '../../../utils/api'
import { MdAdd, MdApps, MdCheckBox, MdDelete, MdEdit, MdInsertChart, MdNewReleases, MdRemoveRedEye, MdSecurity, MdUpdate } from 'react-icons/md'
import { DefaultButton, GridButton, LargeButton } from '../../../components/_button'
import { Modal } from '../../../components/_modal'
import { Form, serialize } from '../../../components/_form'
import { Input } from '../../../components/_input'
import { Select } from '../../../components/_select'
import { AlertContext } from '../../../contexts/alert'
import { TransferList } from '../../../components/_transferList'

type iGroupPermission = {
    id: number
    name: string
    group_id: number
    canUpdate: boolean
    canInsert: boolean
    canDelete: boolean
    canView: boolean
    application_id: number
    group: { id: number, name: string, module_id: number }
    application: { id: number, url: string, displayName: string }
}

const titles = [
{name: 'group.name', label: 'Grupo'},
// {name: 'application.displayName', label: 'Aplicação'},
// {name: 'application.url', label: 'Rota'},
{name: 'action', label: 'Ações'},
]

function Groups () {
    const [dados, setDados] = useState<iGroupPermission[]>([])
    const [loading, setLoading] = useState(false)
    const [selectItem, setSelectItem] = useState<iGroupPermission>({} as iGroupPermission)
    const [modal, setModal] = useState('')
    const { createAlert } = useContext(AlertContext)

    async function getDados() {
        try {
            setLoading(true)
            const response = await api.get('/groups')
            setLoading(false)
            setDados(response.data)
        } catch (error) {
            createAlert(`${error.response.data}`, 'error')
        }
    }

    function handleOpenGroups(item: iGroupPermission){
        setSelectItem(item)
        setModal('groups')
    }

    function handleOpenPermissions(item: iGroupPermission){
        setSelectItem(item)
        setModal('permissions')
    }

    useEffect(() => {
        getDados()
    },[])

    return (
        <>
        <CssBaseline/>
           <Container sx={{ backgroundColor: 'background.default', marginTop: 8, width: '100%', height: '100%'}}>
               <Header title='Gerenciar permissões'>
                   <GridButton type="insert" color="success" onClick={() => setModal('create')} />
               </Header>
               <Grid loading={loading} tableData={dados} setData={setDados} titles={titles} ignoreFilter={['action']}>
                   {
                       dados.map( (item, index) => {
                           return (
                               <Tr key={index}>
                                   <Td>{item.name}</Td>
                                   {/* <Td>{item.application.displayName}</Td> */}
                                   {/* <Td>{item.application.url}</Td> */}
                                   <Td sx={{ width: 150}}>
                                       <Tooltip title="Gerenciar aplicações" >
                                        <IconButton onClick={() => handleOpenGroups(item)} >
                                            <MdApps />
                                        </IconButton>
                                       </Tooltip>
                                       <Tooltip title="Gerenciar permissões" >
                                        <IconButton onClick={() => handleOpenPermissions(item)} >
                                            <MdSecurity />
                                        </IconButton>
                                       </Tooltip>
                                    </Td>
                               </Tr>
                           )
                       })
                   }
               </Grid>
            </Container>
            <Modal open={modal === 'create'} onClose={ () => setModal('')}>
                <FormIncluir closeModal={setModal} getDados={getDados} />
            </Modal>
            <Modal open={modal === 'groups'} onClose={ () => setModal('')}>
                <FormGroups selectItem={selectItem} />
            </Modal>
            <Modal open={modal === 'permissions'} onClose={ () => setModal('')}>
                <FormPermissions selectItem={selectItem} />
            </Modal>

        </>
    )
}

Groups.requireAuth = true

export default Groups


function FormIncluir({ getDados, closeModal }){

    const [loading, setLoading] = useState(false)
    const { createAlert } = useContext(AlertContext)

    async function handleSubmit(event: any){
        const { fields } = serialize(event)
        
        try {
            setLoading(true)
            await api.post('/groups', fields)
            createAlert('Grupo inserido com sucesso!', 'success')
            setLoading(false)
            getDados()
            closeModal('')
        } catch (error) {
            createAlert(`${error.response.data}`, 'error')
        }
    }


    return(
        <Box sx={{ paddingX: 2, paddingY: 4, width: '100vw', maxWidth: 450 }}>
            <Typography variant="h5" fontWeight="bold" >Novo grupo</Typography>
            <Form onSubmit={handleSubmit}>
                <Input type="text" name="name" label="Nome do grupo" required/>
                <Box sx={{ width: '100%', marginTop: 4 }}/>
                <LargeButton type="submit" loading={loading} title="Inserir"/>
            </Form>
        </Box>
    )
}





function FormGroups({ selectItem }){

    const [loading, setLoading] = useState(false)
    const [leftList, setLeftList] = useState<any[]>([])
    const [rightList, setRightList] = useState<any[]>([])
    
    const { createAlert } = useContext(AlertContext)


    async function handleSubmit(){

        const idToAdd = rightList.slice(0).map(item => item.id )
        const idToremove = leftList.slice(0).map(item => item.id )
        try {
            setLoading(true)
            await api.put(`/groups/permissions?group_id=${selectItem.id}`, {add: idToAdd, remove: idToremove } )
            setLoading(false)
            createAlert("Acesso alterado com sucesso", 'success')
        } catch (error) {
            createAlert(`${error.response.data}`, 'error')
            setLoading(false)
        }
    }

    

    useEffect(() => {
        (async function () {
            try {
                setLoading(true)
                const response = await api.get(`/groups/permissions/find?id=${selectItem.id}`)
                const response_app = await api.get(`/groups/applications`)
                const formattedPermissions: any = []

                response.data.forEach( item => {
                    const { application } = item
                    formattedPermissions.push(application)
                    
                })

                const selectedItems: any[] = []
                formattedPermissions.forEach( item => {
                    selectedItems.push(item.id)
                })
                const nonSelected = response_app.data.filter( item => (!selectedItems.includes(item.id)) && item )

                setRightList(formattedPermissions)
                setLeftList(nonSelected)
                setLoading(false)
            } catch (error) {
                createAlert(`${error.response.data}`, 'success')
            }
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <Box sx={{ paddingX: 2, paddingTop: 4, maxWidth: 550 }}>
            <Typography variant="h6" fontWeight="bold" >Permissões {selectItem.name} </Typography>
            <TransferList leftList={leftList} rightList={rightList} setRightList={setRightList} setLeftList={setLeftList} prop="displayName"/>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end',     marginTop: 2, marginBottom: 3}}>
                <DefaultButton loading={loading} onClick={handleSubmit}>Salvar alterações</DefaultButton>
            </Box>
        </Box>
    )
}

function FormPermissions({ selectItem }){ 

    const [dados, setDados] = useState<any[]>([])
    const { createAlert } = useContext(AlertContext)

    const titles = [
        {name: 'application.displayName', label: 'Aplicação'},
        {name: 'application.url', label: 'Rota'},
        {name: 'perm', label: 'Permissões'},
    ]

    async function handleUpdateAccess(item: any){
        try {
            await api.put(`/groups/permissions/access?id=${item.id}`, { data: { canInsert: item.canInsert, canUpdate: item.canUpdate, canDelete: item.canDelete, canView: item.canView }})
            const newArr = dados.slice(0).map(value => {
                if(value.id === item.id){
                    return item
                }
                return value
            })
            setDados([...newArr])
            createAlert('Acesso atualizado com sucesso!', 'success')
        } catch (error) {
            createAlert(`${error.response.data}`, 'error')
            
        }
    }

    useEffect(() => {
        (async function (){
            try {
                const response = await api.get(`/groups/permissions/find?id=${selectItem.id}`)
                setDados(response.data)
            } catch (error) {
                createAlert(`${error.response.data}`, 'error')
            }
            
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Box sx={{ width: '100vw', maxWidth: 750}}>
            <Grid titles={titles} tableData={dados} setData={setDados} ignoreFilter={['perm']} loading={false} >
                {dados.map( (item, index) => {
                    return (
                        <Tr key={index}>
                            <Td>
                                {item.application.displayName}
                            </Td>
                            <Td>
                                {item.application.url}
                            </Td>
                            <Td sx={{ width: 200 }}>
                                <Tooltip title="Inserir">
                                    <IconButton sx={{ color: `${!item.canInsert ? '#dedede' : 'dark'}`}} onClick={() => handleUpdateAccess({ ...item, canInsert: !item.canInsert})} >
                                        <MdAdd />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Editar">
                                    <IconButton sx={{ color: `${!item.canUpdate ? '#dedede' : 'dark'}`}} onClick={() => handleUpdateAccess({ ...item, canUpdate: !item.canUpdate})}>
                                        <MdEdit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Deletar">
                                    <IconButton sx={{ color: `${!item.canDelete ? '#dedede' : 'dark'}`}} onClick={() => handleUpdateAccess({ ...item, canDelete: !item.canDelete})}>
                                        <MdDelete/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Visualizar">
                                    <IconButton sx={{ color: `${!item.canView ? '#dedede' : 'dark'}`}} onClick={() => handleUpdateAccess({ ...item, canView: !item.canView})}>
                                        <MdRemoveRedEye  />
                                    </IconButton>
                                </Tooltip>
                            </Td>
                        </Tr>
                    )
                })}
            </Grid>
        </Box>
    )
}