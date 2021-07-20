import { Box, Button, Container, CssBaseline, Paper, Typography } from '@material-ui/core'
import { signOut, getCsrfToken, getSession, signIn } from 'next-auth/client'
import { serialize } from '../components/_form'
import { Input } from '../components/_input'

function Login({csrfToken}) {

  function handleSubmit(event: any){
    const { fields } = serialize(event)
    signIn('credentials', fields)
  }

  return (
    <Container component="main" maxWidth="xs" sx={{ paddingTop: 10}} >
       <CssBaseline />
       <Paper sx={{ paddingX: 3, paddingTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" fontWeight="bold" variant="h4">
            G5 RH
          </Typography>
          <Box onSubmit={handleSubmit} component="form" noValidate sx={{ mt: 1 }}>
            <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
            <Input
              id="login"
              label="Login"
              name="login"
              autoFocus
              />
            <Input
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button disableElevation type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Entrar
            </Button>
          </Box>
       </Paper>
    </Container>
  )
}

export default function Page({ csrfToken, session }) {
  return (
    <Container sx={{ backgroundColor: 'background.default', width: '100vw', height: '100vh' }} >
        
        {!session && <Login csrfToken={csrfToken}/>
        }
        {session && <>
          <h1>Signed in as {session.user.id} </h1> <br/>
          <button onClick={() => signOut()}>Sign out</button>
        </>}

    </Container>
  )
}

  
export async function getServerSideProps(context) {
    const csrfToken = await getCsrfToken(context)
    const session = await getSession(context)
    if(session) return {
      redirect: {
        destination: '/users'
      }
    }
    
    return {
      props: {
        csrfToken,
        session
      }
    }
  
  }