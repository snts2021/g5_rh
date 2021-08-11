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
    console.log(user)

    if(user) return {
      redirect: {
        destination: '/main'
      }
    }

    return {
      redirect: {
        destination: 'http://localhost:3005'
      }
    }
    
}