import { Button, CircularProgress } from "@material-ui/core"

const LargeButton = ({loading, title, ...props}) => {
  return (
    <Button {...props}>
        {
            loading ?
            <CircularProgress size={25} color="inherit" />
            :
            <>{title}</>
        }
    </Button>
    )
}

export default LargeButton