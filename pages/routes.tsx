import { useSession } from "next-auth/client"
import { TopBar } from "../components/_topBar"

const Routes = ({children}) => {
  
  const [ session ] = useSession()
 
  return (
    <>
    {
      session && (
        <>
          <TopBar />
        </>
      )
    }
      {children}
    </>
    )
}

export default Routes