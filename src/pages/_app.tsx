import '../styles/globals.css'
import { standardTheme } from '../styles/theme'
import { ThemeProvider } from '@material-ui/core'
import { AlertProvider } from '../contexts/alert'
import { Toast } from '../components/_toast'
import { TopBar } from "../components/_topBar"
import { AuthProvider } from '../contexts/auth'

function MyApp({ Component, pageProps }: any) {

  return  (
  <ThemeProvider theme={standardTheme}>
      <AlertProvider>
        <Toast/>
            {
              Component.requireAuth ? 
              <AuthProvider>
                <>
                  <TopBar/>
                  <Component {...pageProps} />
                </>
              </AuthProvider>
              
              : <Component {...pageProps} />
            }
      </AlertProvider>
  </ThemeProvider>
  )
}

export default MyApp
