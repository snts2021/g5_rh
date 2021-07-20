import { Box, Button, Container, CssBaseline, IconButton, MenuItem, TextField, Tooltip, Typography } from "@material-ui/core"
import { getSession } from "next-auth/client"
import { useContext, useEffect, useState } from "react"
import { MdEdit } from "react-icons/md"
import { Form, serialize } from "../../components/_form"
import { Grid, Header, Td, Tr } from "../../components/_grid"
import { Input } from "../../components/_input"
import { Modal } from "../../components/_modal"
import { AlertContext } from "../../contexts/alert"
import { api } from "../../services/api"
import LargeButton from '../../components/_button'

type iDados = {
    id                :number     
    nome              :String  
    cargo             :String  
    unidade           :String  
    login             :String  
    password          :String  
    remember_me_token :String
    created_at        :Date
    updated_at        :Date
}


function UsersCadastro(){

    const [dados, setDados] = useState<iDados[]>([])
    const [loading, setLoading] = useState(false)
    const [modaleditar, setModalEditar] = useState(false)
    const [itemselecionado, setItemselecionado] = useState<iDados>({} as iDados)
    const [modalinserir, setModalInserir] = useState(false)
    //PEGA OS DADOS DA SELECT
    async function getDados(){
        setLoading(true)
        const resultado = await api.get('/users/')
        setDados(resultado.data.dados)
        setLoading(false)
      }
    
    const handleEdit = (item: iDados) => {
        setItemselecionado(item)
        setModalEditar(true)
    }

    useEffect(() => {
     getDados()
    },[])

    return (
        <>
        <CssBaseline />
            <Container sx={{ backgroundColor: 'background.default', marginTop: 8, width: '100vw', height: '100vh'}}>
            <Header title="Usuários" >
            </Header>
                <Button onClick={() => setModalInserir(true)}  variant="contained" color="primary" >
                    Novo
                </Button>
            <Grid tableData={dados} setData={setDados} titles={["","Nome" ]} loading={loading}>
                {
                    dados.map((item, index) => {
                    return(
                        <Tr key={index}>
                        <Td>
                            <Box sx={{ display: 'flex'}}>
                                <Tooltip title="Editar">
                                    <IconButton onClick={() => handleEdit(item)}>
                                        <MdEdit />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Td>
                        <Td>
                            {item.nome}
                        </Td>
                        </Tr>
                    )
                    })
                }
            </Grid>
            {
                modaleditar && <Modal  onClose={setModalEditar} open={modaleditar}> <FormEditar itemselecionado={itemselecionado} getDados={getDados} closeModal={setModalEditar} /> </Modal>
            }
            {
               modalinserir && <Modal  onClose={setModalInserir} open={modalinserir}> 
                    <FormInserir getDados={getDados} closeModal={setModalInserir} /> 
               </Modal>
            }
            </Container>
        </>
    )
}

export default UsersCadastro


export async function getServerSideProps(context) {

    const session = await getSession(context)
    if(!session) return {
      redirect: {
        destination: '/'
      }
    }

   


    return { props: { } }
}

function FormEditar({ itemselecionado, getDados, closeModal }) {
    const { createAlert } = useContext(AlertContext)
    const [loading, setLoading] = useState(false)
    
    async function handleSubmit(event: any){
        const {fields, emptyFields } = serialize(event)
        if(emptyFields.length < 0) return createAlert('Preencha todos os campos', 'error')
        try {
            setLoading(true)
            const res = await api.put('/users/', {item: fields}) //ENVIA OS DADOS PARA O BACK END (API E BANCO DE DADOS)
            createAlert('Registro atualizado com sucesso!', 'success')            
            getDados()
            return closeModal(false)
        } catch (error) {
            setLoading(false)
            console.log(error.response.data)
            // createAlert(`${error.response.data}`, 'danger')
        }

    }

    return (
        <Form onSubmit={handleSubmit} >
            <Box sx={{ paddingY: 3, paddingX: 2, maxWidth: 400 }}>
                <Typography component="h4" variant="h6" fontWeight="bold" >Editar {itemselecionado.nome}</Typography>
                <input name="id" type="hidden" defaultValue={`${itemselecionado.id}`}/>
                <Input label="Nome do Colaborador" name="nome" type="text" defaultValue={`${itemselecionado.nome}`}/>        
                {/* <Input label="Valor" name="valor_taxa" type="text" defaultValue={`${itemselecionado.valor_taxa}`}/> */}
                {/* <Button type="submit" variant="contained" size="large" sx={{ width: '100%', marginTop: 2}} disableElevation>Enviar</Button> */}
                <LargeButton loading={loading} type="submit" variant="contained" size="large" sx={{ width: '100%', marginTop: 2}} disableElevation title="Enviar"  />    
            </Box>
        </Form>
    )
}

function FormInserir({getDados, closeModal }) {
    const { createAlert } = useContext(AlertContext)
    const [loading, setLoading] = useState(false)
    
    async function handleSubmit(event: any){
        const {fields, emptyFields } = serialize(event)
        if(emptyFields.length < 0) return createAlert('Preencha todos os campos', 'error')
        try {
            setLoading(true)
            const res = await api.post('/users/', {item: fields}) //ENVIA OS DADOS PARA O BACK END (API E BANCO DE DADOS)
            createAlert('Registro com sucesso!', 'success')            
            getDados()
            return closeModal(false)
        } catch (error) {
            setLoading(false)
            console.log(error.response.data)
            // createAlert(`${error.response.data}`, 'danger')
        }

    }

    return (
        <Form onSubmit={handleSubmit} >
            <Box sx={{ paddingY: 3, paddingX: 2, maxWidth: 400 }}>
                <Typography component="h4" variant="h6" fontWeight="bold" >Inserir</Typography>
                <Input label="Nome do Colaborador" name="nome" type="text"/>        
                {/* <Input label="Valor" name="valor_taxa" type="text" defaultValue={`${itemselecionado.valor_taxa}`}/> */}
                <LargeButton loading={loading} type="submit" variant="contained" size="large" sx={{ width: '100%', marginTop: 2}} disableElevation title="Enviar"  /> 
                {/* <Button type="submit" variant="contained" size="large" sx={{ width: '100%', marginTop: 2}} disableElevation>Enviar</Button>     */}
            </Box>
        </Form>
    )
}