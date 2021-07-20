import { Box, Container, CssBaseline, Button, IconButton, Tooltip, Typography, TextField, MenuItem, NativeSelect, InputLabel } from "@material-ui/core"
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
import { Select } from "../../components/_select"

type iDados = {
    id_rh_app_chamados  : number
    colaborador         : String
    data_abertura       : Date
    tipo_chamado        : String   
    descricao_chamado   : String   
    anexo_chamado       : string
    status_chamado      : String   
    resposta_chamado    : String   
    data_atendimento    : Date
    usuario_atendimento : String
    data_finalizado     : Date
    usuario_finalizado  : String
}


function Chamados(){

    const [dados, setDados] = useState<iDados[]>([])
    const [loading, setLoading] = useState(false)
    const [modaleditar, setModalEditar] = useState(false)
    const [itemselecionado, setItemselecionado] = useState<iDados>({} as iDados)
    const [modalinserir, setModalInserir] = useState(false)
    //PEGA OS DADOS DA SELECT
    async function getDados(){
        setLoading(true)
        const resultado = await api.get('/chamados/')
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
            <Header title="Consultar Chamados" >
            </Header>
                <Button onClick={() => setModalInserir(true)}  variant="contained" color="primary" >
                    Novo
                </Button>
            <Grid tableData={dados} setData={setDados} titles={["", "N° Chamado","Colaborador", "Descrição", "Status"]} loading={loading}>
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
                                {item.id_rh_app_chamados}
                            </Td>
                            <Td>
                                {item.colaborador}
                            </Td>
                            <Td>
                                {item.descricao_chamado}
                            </Td>
                            <Td>
                                {item.status_chamado}
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

export default Chamados


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
    const [tipoChamados, setTipoChamados] = useState<any[]>([])
    
    async function handleSubmit(event: any){
        const {fields, emptyFields } = serialize(event)
        if(emptyFields.length < 0) return createAlert('Preencha todos os campos', 'error')
        try {
            setLoading(true)
            const res = await api.put('/chamados/', {item: fields}) //ENVIA OS DADOS PARA O BACK END (API E BANCO DE DADOS)
            createAlert('Registro atualizado com sucesso!', 'success')            
            getDados()
            return closeModal(false)
        } catch (error) {
            setLoading(false)
            console.log(error.response.data)
            // createAlert(`${error.response.data}`, 'danger')
        }

    }

    useEffect(()=>{
        (async function(){
            setLoading(true)
            const response = await api.get('/tipo_chamados_cadastro')
            setLoading(false)
            setTipoChamados(response.data.dados)
        })()
    },[]);

    return (
        <Form onSubmit={handleSubmit} >
            <Box sx={{ paddingY: 3, paddingX: 2, maxWidth: 400 }}>
                <Typography component="h4" variant="h6" fontWeight="bold" >Editar {itemselecionado.descricao_chamado}</Typography>
                <input name="id_rh_app_chamados" type="hidden" defaultValue={`${itemselecionado.id_rh_app_chamados}`}/>
                <Select loading={loading}  name="tipo_chamado"  label="Tipo de Chamado"  >
                    {
                        tipoChamados.map( (item, index) => {
                            return (<MenuItem key={index}  value={item.id_rh_web_chamados_tipo_cadastro}>{item.tipo_chamado}</MenuItem>)
                        })
                    }
                </Select>
                <Input label="Descrição" name="descricao_chamado" type="text" defaultValue={`${itemselecionado.descricao_chamado}`}/>   
                <Input label="Anexar Arquivo" name="anexo_chamado" type="text" defaultValue={`${itemselecionado.anexo_chamado}`}/>   
                {/* <Input label="Status" name="status_chamado" type="text" defaultValue={`${itemselecionado.status_chamado}`}/>     */}
                {/* <Input label="Valor" name="valor_taxa" type="text" defaultValue={`${itemselecionado.valor_taxa}`}/> */}
                <LargeButton loading={loading} type="submit" variant="contained" size="large" sx={{ width: '100%', marginTop: 2}} disableElevation title="Enviar"  />  
            </Box>
        </Form>
    )
}

function FormInserir({getDados, closeModal }) {
    const { createAlert } = useContext(AlertContext)
    const [loading, setLoading] = useState(false)
    const [tipoChamados, setTipoChamados] = useState<any[]>([])
    
    async function handleSubmit(event: any){
        const {fields, emptyFields } = serialize(event)
        console.log(fields)
        if(emptyFields.length > 0) return createAlert('Preencha todos os campos', 'error')
        try {
            setLoading(true)
            const res = await api.post('/chamados/', {item: fields}) //ENVIA OS DADOS PARA O BACK END (API E BANCO DE DADOS)
            createAlert('Registro  com sucesso!', 'success')            
            getDados()
            return closeModal(false)
        } catch (error) {
            setLoading(false)
            console.log(error.response.data)
            // createAlert(`${error.response.data}`, 'danger')
        }

    }

    useEffect(()=>{
        (async function(){
            setLoading(true)
            const response = await api.get('/tipo_chamados_cadastro')
            setLoading(false)
            setTipoChamados(response.data.dados)
        })()
    },[]);
    
    return (
        <Form onSubmit={handleSubmit} >
            <Box sx={{ paddingY: 3, paddingX: 2, maxWidth: 400 }}>
                <Typography component="h4" variant="h6" fontWeight="bold" >Inserir</Typography>
                {/* <Input label="Tipo de Chamado" name="tipo_chamado" type="text"/> */}
                <Select loading={loading}  name="tipo_chamado"  label="Tipo de Chamado"  >
                    {
                        tipoChamados.map( (item, index) => {
                            return (<MenuItem key={index}  value={item.id_rh_web_chamados_tipo_cadastro}>{item.tipo_chamado}</MenuItem>)
                        })
                    }
                </Select>
                <Input label="Descrição" name="descricao_chamado" type="text"/> 
                <Input label="Anexar Arquivo" name="anexo_chamado" type="text"/>
                {/* <Input label="Status" name="status_chamado" type="text"/>       */}
                {/* <Input label="Valor" name="valor_taxa" type="text" defaultValue={`${itemselecionado.valor_taxa}`}/> */}
                <LargeButton loading={loading} type="submit" variant="contained" size="large" sx={{ width: '100%', marginTop: 2}} disableElevation title="Enviar"  /> 
                {/* <Button type="submit" variant="contained" size="large" sx={{ width: '100%', marginTop: 2}} disableElevation>Enviar</Button>     */}
            </Box>
        </Form>
    )
}