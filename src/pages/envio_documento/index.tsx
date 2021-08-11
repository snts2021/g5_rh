import { Box, Button, Container, CssBaseline, IconButton, MenuItem, TextField, Tooltip, Typography } from "@material-ui/core"
import { useContext, useEffect, useState } from "react"
import { MdEdit } from "react-icons/md"
import { Form, serialize } from "../../components/_form"
import { Grid, Header, Td, Tr } from "../../components/_grid"
import { Input } from "../../components/_input"
import { Modal } from "../../components/_modal"
import { AlertContext } from "../../contexts/alert"
import { api } from "../../utils/api"
import {LargeButton, GridButton} from '../../components/_button'


type iDados = {
    id_rh_app_documentos : number
    colaborador          : String
    descricao            : String
    arquivo              : String
}


function EnvioDocumento(){

    const [dados, setDados] = useState<iDados[]>([])
    const [loading, setLoading] = useState(false)
    const [modaleditar, setModalEditar] = useState(false)
    const [itemselecionado, setItemselecionado] = useState<iDados>({} as iDados)
    const [modalinserir, setModalInserir] = useState(false)
    
    const { createAlert } = useContext(AlertContext)
    
    //PEGA OS DADOS DA SELECT
    async function getDados(){
        setLoading(true)
        try {
            const resultado = await api.get('/envio_documento/')
            setDados(resultado.data.dados)
            setLoading(false)
        } catch (error) {
            createAlert(`${error.response.data}`, 'error')
        }

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
            <Header title="Documentos" >
            </Header>
                {/* <Button onClick={() => setModalInserir(true)}  variant="contained" color="primary" >
                    Novo
                </Button> */}
            <GridButton onClick={() => setModalInserir(true)}  type="insert" color="success" sx={{ marginBottom: 2 }} />
            <Grid tableData={dados} setData={setDados} titles={["","Descrição","Documento" ]} loading={loading}>
                {
                    dados.map((item, index) => {
                    return(
                        <Tr key={index}>
                            <Td width="10px">
                                <Box sx={{ display: 'flex'}}>
                                    <Tooltip title="Editar">
                                        <IconButton onClick={() => handleEdit(item)}>
                                            <MdEdit />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Td>
                            <Td>
                                {item.descricao}
                            </Td>
                            <Td>
                            <a download href={`${item.arquivo}`} target="_blank" rel="noreferrer" >Vizualizar</a>
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
EnvioDocumento.requireAuth = true

export default EnvioDocumento

function FormEditar({ itemselecionado, getDados, closeModal }) {
    const { createAlert } = useContext(AlertContext)
    const [loading, setLoading] = useState(false)
    
    async function handleSubmit(event: any){
        const {form, emptyFields } = serialize(event)
        if(emptyFields.length < 0) return createAlert('Preencha todos os campos', 'error')
        try {
            setLoading(true)
            const res = await api.put(`/envio_documento?id_rh_app_documentos=${itemselecionado.id_rh_app_documentos}`, form) //ENVIA OS DADOS PARA O BACK END (API E BANCO DE DADOS)
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
            <Box sx={{ paddingY: 3, paddingX: 2, width: '95vw',  maxWidth: 400 }}>
                <Typography component="h4" variant="h6" fontWeight="bold" >Editar Registro</Typography>
                {/* <input name="id_rh_app_documentos" type="hidden" defaultValue={`${itemselecionado.id_rh_app_documentos}`}/> */}
                <Input label="Descrição" name="descricao" type="text" defaultValue={`${itemselecionado.descricao}`}/>        
                <Input label="Documento" name="envio_documento" type="file" />
                {/* <a download href={itemselecionado.arquivo} target="_blank" rel="noreferrer" >Vizualizar</a> */}
                {/* <Button type="submit" variant="contained" size="large" sx={{ width: '100%', marginTop: 2}} disableElevation>Enviar</Button> */}
                <LargeButton loading={loading} type="submit" variant="contained" size="large" sx={{ width: '100%', marginTop: 2}} disableElevation title="Enviar"  />    
            </Box>
        </Form>
    )
}
// defaultValue={`${itemselecionado.arquivo}`}
function FormInserir({getDados, closeModal }) {
    const { createAlert } = useContext(AlertContext)
    const [loading, setLoading] = useState(false)
    
    async function handleSubmit(event: any){
        const {form, emptyFields } = serialize(event)
        if(emptyFields.length < 0) return createAlert('Preencha todos os campos', 'error')
        try {
            setLoading(true)
            const res = await api.post('/envio_documento/', form) //ENVIA OS DADOS PARA O BACK END (API E BANCO DE DADOS)
            createAlert('Registro com sucesso!', 'success')            
            setLoading(false)
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
            <Box sx={{ paddingY: 3, paddingX: 2, width: '95vw',  maxWidth: 400 }}>
                <Typography component="h4" variant="h6" fontWeight="bold" >Inserir</Typography>
                <Input onChange={(value)=>console.log(value)} label="Descrição" name="descricao" type="text"/>
                <Input label="Anexar Documento" name="envio_documento" type="file"/>    
                {/* <Input label="Valor" name="valor_taxa" type="text" defaultValue={`${itemselecionado.valor_taxa}`}/> */}
                {/* <LargeButton loading={loading} type="submit" variant="contained" size="large" sx={{ width: '100%', marginTop: 2}} disableElevation title="Enviar"  />  */}
                <LargeButton loading={loading} title='Enviar' type='submit'></LargeButton>
            </Box>
        </Form>
    )
}


