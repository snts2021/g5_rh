import { TextField } from "@material-ui/core"

export const Input = (props) => {
    return (
        <TextField 
            margin="normal"
            fullWidth
            variant="standard"
            {...props}
        />
    )
}