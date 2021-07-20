import '../styles/globals.css'
import { Provider } from 'next-auth/client'
import { standardTheme } from '../styles/theme'
import { ThemeProvider } from '@material-ui/core'
import Routes from './routes'
import { AlertProvider } from '../contexts/alert'
import { Toast } from '../components/_toast'




function MyApp({ Component, pageProps }: any) {

  return  (
  <ThemeProvider theme={standardTheme}>
      <AlertProvider>
        <Toast/>
        <Provider session={pageProps.session}>
          <Routes>
            <Component {...pageProps} />
          </Routes>
        </Provider>
      </AlertProvider>
  </ThemeProvider>
  )
}

export default MyApp

