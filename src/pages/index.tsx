import { Box, Button, Container, CssBaseline, Paper, Typography } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { LargeButton } from '../components/_button'
import { serialize } from '../components/_form'
import { Input } from '../components/_input'
import { AlertContext } from '../contexts/alert'
import { getSession } from '../middleware/auth'
import { api } from '../utils/api'

function Login() {
  const [loading, setLoading] = useState(false)
  const { createAlert } = useContext(AlertContext)
  const router = useRouter()

  async function handleSubmit(event: any){
    const { fields } = serialize(event)

    try {
      setLoading(true)
      const response = await api.post('/auth/login', fields)
      setLoading(false)
      createAlert(`${response.data}`, 'success')
      router.reload()
      
    } catch (error) {
      setLoading(false)
      createAlert(`${error.response?.data}`, 'error')
    }
  }

  return (
    <Container component="main" maxWidth="xs" sx={{ paddingTop: 10}} >
       <CssBaseline />
       <Paper sx={{ paddingX: 3, paddingTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" fontWeight="bold" variant="h4">
            G5 RH
          </Typography>
          <Box onSubmit={handleSubmit} component="form" noValidate sx={{ mt: 1 }}>
            <Input
              id="login"
              label="Login"
              name="login"
              autoFocus
              />
            <Input
              name="password" 
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <LargeButton type="submit" title="Entrar" loading={loading} sx={{ mt: 3, mb: 2, width: '100%' }} />
          </Box>
       </Paper>
    </Container>
  )
}

export default function Page({ csrfToken, session }) {
  return (
    <Container sx={{ backgroundColor: 'background.default', width: '100vw', height: '100vh' }} >  
      <Login/>
    </Container>
  )
}

  
export async function getServerSideProps(context) {
    const user = await getSession(context.req)

    if(user) return {
      redirect: {
        destination: '/chamados'
      }
    }

    return {
      props: {
      }
    }
  
  }