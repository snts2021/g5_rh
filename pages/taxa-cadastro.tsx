import { Box, Button, Container, CssBaseline, IconButton, Tooltip, Typography } from "@material-ui/core"
import { getSession } from "next-auth/client"
import { useContext, useEffect, useState } from "react"
import { MdEdit } from "react-icons/md"
import { Form, serialize } from "../components/_form"
import { Grid, Header, Td, Tr } from "../components/_grid"
import { Input } from "../components/_input"
import { Modal } from "../components/_modal"
import { AlertContext } from "../contexts/alert"
import { api } from "../services/api"

type iCadastroTaxa = {
    id_custo_taxa: number
    nome_taxa: string
    valor_taxa: number
}


function CadastroTaxa(){

    const [dados, setDados] = useState<iCadastroTaxa[]>([])
    const [loading, setLoading] = useState(false)
    const [modaleditar, setModalEditar] = useState(false)
    const [itemselecionado, setItemselecionado] = useState<iCadastroTaxa>({} as iCadastroTaxa)

    async function getDados(){
        setLoading(true)
        const resultado = await api.get('/taxas/')
        setDados(resultado.data.taxas)
        setLoading(false)
      }
    
    const handleEdit = (item: iCadastroTaxa) => {
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
            <Header title="Cadastrar taxas" >
            </Header>
            <Grid tableData={dados} setData={setDados} titles={["","Taxa", "Valor"]} loading={loading}>
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
                            {item.nome_taxa}
                        </Td>
                        <Td>
                            {`${item.valor_taxa}`.replace('.', ',')}
                        </Td>
                        </Tr>
                    )
                    })
                }
            </Grid>
            {
                modaleditar && <Modal  onClose={setModalEditar} open={modaleditar}> <FormEditar itemselecionado={itemselecionado} getDados={getDados} closeModal={setModalEditar} /> </Modal>
            }
            </Container>
        </>
    )
}

export default CadastroTaxa


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
            fields.valor_taxa = fields.valor_taxa.replace(',','.')
            setLoading(true)
            const res = await api.post('/taxas/update', {item: fields}) //ENVIA OS DADOS PARA O BACK END (API E BANCO DE DADOS)
            createAlert('Registro atualizado com sucesso!', 'success')            
            getDados()
            return closeModal(false)
        } catch (error) {
            setLoading(false)
            console.log(error.response.data)
            createAlert(`${error.response.data.errors.field}`, 'danger')
        }

    }

    return (
        <Form onSubmit={handleSubmit} >
            <Box sx={{ paddingY: 3, paddingX: 2, maxWidth: 400 }}>
                <Typography component="h4" variant="h6" fontWeight="bold" >Editar {itemselecionado.nome_taxa}</Typography>
                <input name="id_custo_taxa" type="hidden" defaultValue={`${itemselecionado.id_custo_taxa}`}/>
                <Input label="Taxa" name="nome_taxa" type="text" defaultValue={`${itemselecionado.nome_taxa}`}/>        
                <Input label="Valor" name="valor_taxa" type="text" defaultValue={`${itemselecionado.valor_taxa}`}/>
                <Button type="submit" variant="contained" size="large" sx={{ width: '100%', marginTop: 2}} disableElevation>Enviar</Button>    
            </Box>
        </Form>
    )
}