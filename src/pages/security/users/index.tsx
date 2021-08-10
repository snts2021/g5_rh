import { Box, Container, CssBaseline, IconButton, Typography } from '@material-ui/core'
import { useContext, useEffect, useState } from 'react'
import { MdPeople } from 'react-icons/md'
import { DefaultButton, GridButton } from '../../../components/_button'
import { Grid, Header, Td, Tr } from '../../../components/_grid'
import { Modal } from '../../../components/_modal'
import { TransferList } from '../../../components/_transferList'
import { AlertContext } from '../../../contexts/alert'
import { api } from '../../../utils/api'
import { FormInsert } from './insert'

type iGroups = {
    group: {
        id: number
        name: string
        module_id: number
    }
}

type iDados = {
    id: number
    login: string
    name: string
    groups: iGroups[]
}

const titles = [
    {name: 'login', label: 'Nome login'},
    {name: 'group', label: 'Grupo'},
]

function Users () {
    
    const [dados, setDados] = useState<iDados[]>([])
    const [modal, setModal] = useState('')
    const [selectedItem, setSelectedItem] = useState<iDados>()
    const {createAlert} = useContext(AlertContext)
    
    async function getDados(){
        try {
            const response = await api.get('/users')
            setDados(response.data)
        } catch (error) {
            createAlert(`${error.response.data}`, 'error')
        }
    }
    
    function handleEditGroups(item: any){
        setSelectedItem(item)
        setModal('group')
    }

    useEffect(() => {
        getDados()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
        <CssBaseline/>
           <Container sx={{ backgroundColor: 'background.default', marginTop: 8, width: '100%', height: '100%'}}>
               <Header title='Usuários'>
                   <GridButton color="success" type="insert" onClick={() => setModal('insert')} />
               </Header>
               <Grid tableData={dados} setData={setDados} titles={titles} ignoreFilter={['login', 'group']} >
                   {
                       dados.map( (item, index) => {
                           return (
                               <Tr key={index}>
                                   <Td>{item.login}</Td>
                                   <Td sx={{ width: 50 }}>
                                       <IconButton onClick={() => handleEditGroups(item)} >
                                           <MdPeople size={20} />
                                       </IconButton>
                                   </Td>
                               </Tr>
                           )
                       })
                   }
               </Grid>
            </Container>
            <Modal open={modal === 'insert'} onClose={() => setModal('')}>
                <FormInsert getDados={getDados} closeModal={() => setModal('')}/>
            </Modal>
            <Modal open={modal === 'group'} onClose={() => setModal('')}>
                <Groups selectedItem={selectedItem} />
            </Modal>
        </>
    )
}

Users.requireAuth = true

export default Users

function Groups({ selectedItem }){

    const [loading, setLoading] = useState(false)
    const [leftList, setLeftList] = useState<any[]>([{ id: 1, name: 'Carregando'}])
    const [rightList, setRightList] = useState<any[]>([{ id: 1, name: 'Carregando'}])
    const {createAlert} = useContext(AlertContext)

    async function handleSubmit(){
        try {
            const add = rightList.map( item => item.id)
            const remove = leftList.map( item => item.id)
            await api.put(`/users/groups?user_id=${selectedItem.id}`,{add, remove })
            createAlert('Grupo atualizado com sucesso!', 'success')
        } catch (error) {
            createAlert(`${error.response.data}`, 'success')
        }
    }

    useEffect(() => {
        (async function(){
            try {
                setLoading(true)
                const responseGroupsUser = await api.get(`/users/${selectedItem.id}`)
                const responseGroups = await api.get("/groups")
                
                const formattedGroups = responseGroupsUser.data.groups.map( item => item.group)
                
                setRightList(formattedGroups)

                const selectedItems: any[] = []
                formattedGroups.forEach( item => {
                    selectedItems.push(item.id)
                })
                const nonSelected = responseGroups.data.filter( item => (!selectedItems.includes(item.id)) && item )

                setLeftList(nonSelected)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.log(error.response.data)   
            }
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Box sx={{ paddingX: 2, paddingTop: 4, maxWidth: 550 }}>
            <Typography variant="h6" fontWeight="bold" >Grupos de {selectedItem.name}  </Typography>
            <TransferList leftList={leftList} rightList={rightList} setRightList={setRightList} setLeftList={setLeftList} prop="name" />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2, marginBottom: 3}}>
                <DefaultButton loading={loading} onClick={handleSubmit}>Salvar alterações</DefaultButton>
            </Box>
        </Box>
    )
}