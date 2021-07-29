import { Box, Container, CssBaseline, Button, IconButton, Tooltip, Typography, TextField, MenuItem, NativeSelect, InputLabel, Alert } from "@material-ui/core"
import { useContext, useEffect, useState } from "react"
import { MdEdit } from "react-icons/md"
import { Form, serialize } from "../../components/_form"
import { Grid, Header, Td, Tr } from "../../components/_grid"
import { Input } from "../../components/_input"
import { Modal } from "../../components/_modal"
import { AlertContext } from "../../contexts/alert"
import { api } from "../../utils/api"
import { LargeButton, GridButton } from '../../components/_button'
import { Select } from "../../components/_select"
import Image from 'next/image'
import { url } from "node:inspector"

///INFORMA CAMPOS PUXADOS DO BACKEND//
type iDados = {
    id_rh_app_chamados    : number
    colaborador           : String
    data_abertura         : Date
    tipo_chamado          : String   
    descricao_chamado     : String   
    anexo_chamado         : string
    status_chamado        : String   
    resposta_chamado      : String   
    data_atendimento      : Date
    descricao_atendimento : String
    usuario_atendimento   : String
    data_finalizado       : Date
    usuario_finalizado    : String
}


function Chamados(){
    const {createAlert} = useContext(AlertContext)
    const [dados, setDados] = useState<iDados[]>([])
    const [loading, setLoading] = useState(false)
    const [modaleditar, setModalEditar] = useState(false)
    const [itemselecionado, setItemselecionado] = useState<iDados>({} as iDados)
    const [modalImagem, setModalImagem] = useState(false)
    const [guardarImagem, setGuardarImagem] = useState(' ')
    const [isModalVisible, setIsModalVisible] = useState('')
    const [modalinserir, setModalInserir] = useState(false)
    const [modalfinalizado, setModalFinalizado] = useState(false)
    //PEGA OS DADOS DA SELECT
    async function getDados(){
        setLoading(true)
        const resultado = await api.get('/chamados/')
        setDados(resultado.data.dados)
        setLoading(false)
      }
    
    const handleEdit = (item: iDados) => {
        setModalEditar(true)
    }

    function handleOpenModal(url: string){
        setModalImagem(true)
        setGuardarImagem(url)
    }

    async function handleMudarStatus(item: iDados){
        if(item.status_chamado === "ABERTO"){
            setIsModalVisible('Alterar status')
            setItemselecionado(item)
            
        }else if(item.status_chamado === "EM ANDAMENTO"){
            setIsModalVisible('Alterar status')
            setItemselecionado(item)
        }

    }

    async function handleDescricao(item: iDados){
        setIsModalVisible('Descricao')
        setItemselecionado(item)
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
                <GridButton onClick={() => setModalInserir(true)}  type="insert" color="success" sx={{ marginBottom: 2 }} />
            <Grid tableData={dados} setData={setDados} titles={[
                {name:"", label:"Chamado"}, 
                {name:"tipo_chamado", label:"Informações do Chamado"}, 
                {name: "", label:"Descrição"}, 
                {name: "",label: "Anexo"},
                {name: "status_chamado", label: "Status"},
                {name: "", label: " "}]} 
                 loading={loading}>
                {
                    dados.map((item, index) => {
                    return(
                        <Tr key={index}>
                            <Td>
                                <Box sx={{width: 100}}>
                                    <Typography variant='caption'><b>N°:</b> {item.id_rh_app_chamados}</Typography>
                                    <br/>
                                    <Typography variant='caption'><b>Abertura:</b> <br/>{new Date(item.data_abertura).toLocaleString('pt-br', {year:"numeric", month: 'numeric', day: "numeric", hour:"2-digit", minute:"2-digit" })}</Typography>
                                </Box>
                            </Td>
                            <Td>
                             <Box>
                                    <Typography variant='caption'><b>Colaborador:</b> <br/>{item.colaborador}</Typography>
                                    <br/>
                                    <Typography variant='caption'><b>Tipo de Chamado:</b> <br/>{item.tipo_chamado}</Typography>
                                </Box>
                            </Td>
                            <Td>
                                {item.descricao_chamado}
                            </Td>
                            <Td>
                                {
                                    item.anexo_chamado &&    
                                    <Box onClick={() =>  handleOpenModal(item.anexo_chamado)} sx={{ cursor:'pointer', height: 40, width: 40, position: 'relative'}}>
                                        <Image
                                            src={item.anexo_chamado}
                                            alt="My Image"
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </Box>
                                }
                            </Td>
                            <Td>
                            <Button 
                                onClick={() => handleMudarStatus(item)} 
                                sx={{ 
                                    height: 22, 
                                    width: 120,
                                    fontSize: 11, 
                                    backgroundColor: "#d0d0d0", 
                                    borderRadius: 10, 
                                    color: "#080808", 
                                    ":hover": { 
                                        backgroundColor: "#e8e8e8"
                                    }
                                }}
                                disableElevation 
                            > 
                                {item.status_chamado}
                            </Button>    
                            </Td>
                            <Td >
                                <Box component="div" sx={{ overflow: 'hidden', width: '200px', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    {item.status_chamado === 'EM ANDAMENTO' 
                                    ? 
                                    <>
                                    <Typography variant='caption'><b>Atendido Por:</b> {item.usuario_atendimento}</Typography> 
                                        <br/>
                                        <Typography variant='caption' sx={{ cursor: 'pointer'}} onClick={()=>  handleDescricao(item)}><b>Descrição:</b>{item.descricao_atendimento}</Typography> 
                                        <br/>
                                        <Typography variant='caption'><b>Data:</b> {new Date(item.data_atendimento).toLocaleString('pt-br', {year:"numeric", month: 'numeric', day: "numeric", hour:"2-digit", minute:"2-digit" })}</Typography>
                                    </>
                                    : 
                                    ""}
                                    {item.status_chamado === 'FINALIZADO' 
                                    ? 
                                    <>
                                    <Typography variant='caption'><b>Finalizado Por:</b> {item.usuario_finalizado}</Typography> 
                                        <br/>
                                        <Typography variant='caption' onClick={()=> handleDescricao(item)}><b>Descrição:</b> {item.resposta_chamado} </Typography> 
                                        <br/>
                                        <Typography variant='caption'><b>Data:</b> {new Date(item.data_finalizado).toLocaleString('pt-br', {year:"numeric", month: 'numeric', day: "numeric", hour:"2-digit", minute:"2-digit" })}</Typography>
                                    </>
                                    : 
                                    ""}
                                </Box>
                            </Td>
                        </Tr>
                    )
                    })
                }
            </Grid>
                <Modal  onClose={setIsModalVisible} open={(isModalVisible === "Alterar status") ? true : false }> 
                    <FormAlterarStatus itemselecionado={itemselecionado}getDados={getDados}closeModal={setIsModalVisible} /> 
               </Modal>
               <Modal  onClose={setIsModalVisible} open={(isModalVisible === "Descricao") ? true : false }> 
                    <FormDescricao itemselecionado={itemselecionado}getDados={getDados}closeModal={setIsModalVisible} /> 
               </Modal>
                <Modal  onClose={setModalInserir} open={modalinserir}> 
                    <FormInserir getDados={getDados} closeModal={setModalInserir} /> 
               </Modal>
                <Modal open={modalfinalizado} onClose={setModalFinalizado}>
                    {/* <FormFinalizar {itemselecionado, getDados, closeModal} /> */}
                </Modal>
                <Modal onClose={setModalImagem} open={modalImagem} >
                    <Box sx={{width:'100vw', height:'70vh', position:'relative', maxWidth:'800px'}}>
                        <Image
                            src={guardarImagem}
                            alt="My Image"
                            layout="fill"
                            objectFit="contain"
                        />
                    </Box>
                </Modal>
            </Container>
        </>
    )
}

Chamados.requireAuth = true

export default Chamados

function FormAlterarStatus({ itemselecionado, getDados, closeModal }){
    const { createAlert } = useContext(AlertContext)
    const [loading, setLoading] = useState(false)
    async function handleSubmit(event){
        const{fields, form}=serialize(event)
        try {

            setLoading(true)
            const response = await api.put(`/chamados?id_rh_app_chamados=${itemselecionado.id_rh_app_chamados}`, form)
            setLoading(false)
            getDados()
            closeModal('')
            console.log(response.data)
        } catch (error) {
            console.log(error.response.data,fields)
        }
    }

    return(
        <Box sx={{ paddingY: 3, paddingX: 2, maxWidth: 400 }}>
            <Form onSubmit={handleSubmit}>
            <Typography component="h4" variant="h6" fontWeight="bold" >Inserir</Typography>     
                <Select loading={false}  name="status_chamado"  label="Status do Chamado" defaultValue={itemselecionado.status_chamado} >
                    <MenuItem value='EM ANDAMENTO'>EM ANDAMENTO</MenuItem>
                    <MenuItem value='FINALIZADO'>FINALIZADO</MenuItem>
                </Select>
                <Input label="Descrição" name="descricao" type="text" multiline rows={4}/>
                <LargeButton loading={loading} type="submit" variant="contained" size="large" sx={{ width: '100%', marginTop: 2}} disableElevation title="Enviar"  /> 
            </Form>
        </Box>
    )
}

function FormDescricao({ itemselecionado, getDados, closeModal }){
    const { createAlert } = useContext(AlertContext)
    const [loading, setLoading] = useState(false)
    async function handleSubmit(event){
        const{fields, form}=serialize(event)
        try {

            setLoading(true)
            const response = await api.put(`/chamados?id_rh_app_chamados=${itemselecionado.id_rh_app_chamados}`, form)
            setLoading(false)
            getDados()
            closeModal('')
            console.log(response.data)
        } catch (error) {
            console.log(error.response.data,fields)
        }
    }

    return(
        <Box sx={{ paddingY: 3, paddingX: 2, maxWidth: 400 }}>
            <Form onSubmit={handleSubmit} border-radius>
            <Typography component="h4" variant="h6" fontWeight="bold" >Descrição</Typography>
            <br/>
                {(itemselecionado.status_chamado === "EM ANDAMENTO") ? itemselecionado.descricao_atendimento : itemselecionado.resposta_chamado}
            {/* <Typography component="h4" variant="h6" fontWeight="bold" >Inserir</Typography>     
                <Select loading={false}  name="status_chamado"  label="Status do Chamado" defaultValue={itemselecionado.status_chamado} >
                    <MenuItem value='EM ANDAMENTO'>EM ANDAMENTO</MenuItem>
                    <MenuItem value='FINALIZADO'>FINALIZADO</MenuItem>
                </Select>
                <Input label="Descrição" name="descricao" type="text" multiline rows={4}/> */}
                {/* <LargeButton loading={loading} type="submit" variant="contained" size="large" sx={{ width: '100%', marginTop: 2}} disableElevation title="Enviar"  />  */}
            </Form>
        </Box>
    )
}





function FormInserir({getDados, closeModal }) {
    const { createAlert } = useContext(AlertContext)
    const [loading, setLoading] = useState(false)
    const [tipoChamados, setTipoChamados] = useState<any[]>([])
    
    async function handleSubmit(event: any){
        const {form, emptyFields, fields } = serialize(event)
        if(emptyFields.length > 0) return createAlert('Preencha todos os campos', 'error')
        try {
            setLoading(true)
            await api.post('/chamados/', form) //ENVIA OS DADOS PARA O BACK END (API E BANCO DE DADOS)
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
                <Select loading={loading}  name="tipo_chamado"  label="Tipo de Chamado"  >
                    {
                        tipoChamados.map( (item, index) => {
                            return (<MenuItem key={index}  value={item.tipo_chamado}>{item.tipo_chamado}</MenuItem>)
                        })
                    }
                </Select>
                <Input label="Descrição" name="descricao_chamado" type="text"/> 
                <Input label="Anexar Arquivo" name="anexo_chamado" type="file"/>
                <LargeButton loading={loading} type="submit" variant="contained" size="large" sx={{ width: '100%', marginTop: 2}} disableElevation title="Enviar"  /> 
            </Box>
        </Form>
    )
}
