import { Box, Typography } from "@material-ui/core"
import { useContext, useState } from "react"
import { LargeButton } from "../../../components/_button"
import { Form, serialize } from "../../../components/_form"
import { Input } from "../../../components/_input"
import { AlertContext } from "../../../contexts/alert"
import { api } from "../../../utils/api"

export function FormInsert({closeModal, getDados}) {

    const {createAlert} = useContext(AlertContext)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event){ 
        const { fields } = serialize(event)
        try {
            setLoading(true)
            await api.post('/users', {user: fields})
            setLoading(false)
            createAlert(`Usuário inserido com sucesso`, 'success')
            closeModal(false)
            getDados()
        } catch (error) {
            createAlert(`${error.response.data}`, 'error')
            setLoading(false)
        }

    }

    return (
        <Box sx={{ paddingX: 2, paddingY: 4, maxWidth: 450 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold'}} >Novo usuário</Typography>
            <Form onSubmit={handleSubmit}>
                <Input name="name" type="text" label="Nome" />
                <Input name="login" type="text" label="Login" />
                <Input name="password" type="password" label="Senha" />
                <Box sx={{ width: '100%', marginTop: 2}}>
                    <LargeButton type="submit" loading={loading} title="Inserir" />
                </Box>
            </Form>
        </Box>
    )
}