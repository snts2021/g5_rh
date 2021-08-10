import { Button, CircularProgress } from "@material-ui/core"

const LargeButton = ({loading, title, ...props}) => {
  return (
    <Button sx={{width: '100%', fontWeight: 'bold', color: 'white'}} variant="contained" disabled={loading} disableElevation {...props} >
        {
            loading ?
            <CircularProgress size={25} color="inherit" />
            :
            <>{title}</>
        }
    </Button>
    )
}

type iGridButton = {
    type?: 'insert'|'update'| 'delete'
    color: 'success' | 'error' | 'primary' 
    onClick: any
    sx?: any
    title?: string
}

function GridButton({ type, color, title, ...props} :iGridButton){
  
    function getTitleByType(){
        switch (type) {
            case 'insert':
                return 'Inserir'
            case 'update':
                return 'Atualizar'
            case 'delete':
                return 'Apagar'
        }
    }

    return (
    <Button variant="contained" color={color} disableElevation sx={{ fontWeight: 'bold', color: 'white'}} {...props} >
        {
            title ? title : getTitleByType()
        }
    </Button>
    )
}

function DefaultButton({loading = false, children, ...props}) {
    return (
        <Button disabled={loading} disableElevation {...props} >
            {
                loading ?
                <CircularProgress size={25} color="inherit" />
                :
                <>{children}</>
            }
        </Button>
    )
}

export  {LargeButton, GridButton, DefaultButton}