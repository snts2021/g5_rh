export default function Index(){
    return <div />
}

export function getServerSideProps() {
    return {
        redirect: {
          destination: '/security/users'
        }
      }
}