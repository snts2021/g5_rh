import { Box, Container, CssBaseline } from "@material-ui/core"
import { useEffect, useState } from "react"
import { Grid, Header, Td, Tr } from "../components/_grid"
import { api } from "../services/api"

type iCustoSalarioTaxa = {
    id_custo_salario_taxa: number
    categoria: string
    funcao: string
    tx_cota: number
    tx_salario_base: number
    tx_adicional_insalubridade: number
    tx_rsr: number
    salario: number
    adicional_salario: number
    tx_convencao: number
}

function TaxaSalario() {

    const [dados, setDados] = useState<iCustoSalarioTaxa[]>([])
    const [loading, setLoading] = useState(false)

    async function getDados(){
        setLoading(true)
        const resultado = await api.get('/taxas/salario')
        setDados(resultado.data.taxas)
        setLoading(false)
    }
    useEffect(() =>{
        getDados()
    },[])

    return (
        <>
        <CssBaseline />
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Box sx={{ backgroundColor: 'background.default', marginTop: 8, maxWidth: {xs: '400px', sm: '600px', md: '800px', lg: '1200px', xl: '1500px'}, height: '100vh'}}>
                <Header title="Cadastrar taxas" >
                </Header>
                <Grid tableData={dados} setData={setDados} titles={["Ações", "Categoria", "Função", "Cota", " Adc. Insalubridade", "RSR", "Salário Base", "Adicional Salário", "TX Conveção"]} loading={loading}>
                    {
                        dados.map((item, index) =>{
                            return(
                                <Tr key={index}>
                                    <Td>
                                        {/* <div className="flex">
                                            <Button noStyle className="pr-2" hint="Editar" onClick={()=> handleEdit(item)}>
                                                <MdEdit className="text-xl"/>
                                            </Button>    
                                            <Button noStyle className="pr-2" hint="Excluir" onClick={()=> handleOpenModalDelete(item)}>
                                                <MdDelete className="text-xl text-red-500"/>
                                            </Button>
                                        </div> */}
                                    </Td>   
                                    <Td>
                                        {item.categoria}
                                    </Td>          
                                    <Td>
                                        {item.funcao}
                                    </Td>          
                                    <Td>
                                        {item.tx_cota}
                                    </Td>          
                                    <Td className="text-center">
                                        {item.tx_adicional_insalubridade}
                                    </Td>          
                                    <Td>
                                        {item.tx_rsr}
                                    </Td>          
                                    <Td>
                                        {item.salario}
                                    </Td>          
                                    <Td>
                                        {item.adicional_salario}
                                    </Td>          
                                    <Td>
                                        {item.tx_convencao}
                                    </Td>
                                </Tr>
                            )
                        })
                    }
                </Grid>

            </Box>
        </Box>
        </>
    )
}

export default TaxaSalario