import { MenuItem, TextField, StandardTextFieldProps  } from "@material-ui/core"
import { useState } from "react"

interface iProps extends StandardTextFieldProps {
    loading?: boolean
}

export function Select ({loading=false, children, ...props}: iProps){

    const [value, setValue] = useState('')

    return (
        <>
            <TextField {...props} value={value} onChange={(that)=> setValue(that.target.value)} sx={{ width: '100%' }} variant="standard" select>
                {
                    loading && <MenuItem value="Carregando">Carregando</MenuItem>
                }
                {
                    children
                }
            </TextField>
        </>
    )
}