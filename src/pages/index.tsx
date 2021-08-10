import { getSession } from "../middleware/auth"

export default function Page() {
  return (
    <>  
      <h1>Você não tem permissão de acesso</h1>
    </>
  )
}

  
export async function getServerSideProps(context) {
    const user = await getSession(context.req)
  

    if(user) return {
      redirect: {
        destination: '/main'
      }
    }
    
return{redirect: {
  destination: '/login'
}}

    return {
      props: {}
    }
  
  }