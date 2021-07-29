import { Box, TextField, Typography } from "@material-ui/core"
import { useRef, useState } from "react"
import { MdAttachFile } from "react-icons/md"

export const Input = (props) => {
    
    const [textFile, setTextFile] = useState('') 

    const fileInput = useRef<any>()

    function handleChange(){
        console.log()
        if(fileInput.current.value) {
            setTextFile(`${fileInput.current.value}`)
        }else {
            setTextFile('')
        }
    }

    if(props.type === "file") 
        return (
            <Box sx={{ position: 'relative', marginY: 2}}>
                <Box component="label"
                    htmlFor={props.name} 
                    sx={{
                        cursor: 'pointer',
                        ":hover":{
                            ':before': {
                                borderBottom: '2px solid rgba(0, 0, 0, 0.87)'
                            }
                        },
                        ':before': {
                            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                            left: 0,
                            bottom: 0,
                            right: 0,
                            content: "' '",
                            position: 'absolute',
                            WebkitTransition: "border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                        } ,
                        ':after': {
                            borderBottom: '2px solid #009cb4',
                            left: 0,
                            bottom: 0,
                            right: 0,
                            transform: `${ textFile ? 'scaleX(1)' : 'scaleX(0)'}`,
                            content: "' '",
                            position: 'absolute',
                            WebkitTransition: "border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                        }
                    }} 
                >   
                    <Box sx={{ 
                        display: 'flex', 
                        gap: 1, 
                        paddingBottom: 1, 
                       
                    }}>
                        <Box>
                            <MdAttachFile size={20} />
                        </Box>
                        <Typography
                            sx={{
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                            }}
                        >{ textFile ? textFile : 'Selecionar arquivo'}</Typography>
                    </Box>
                    <input ref={fileInput} style={{ display: 'none' }} onChange={() => handleChange()} id={props.name} {...props}/>
                </Box>
            </Box>
        )

    return (
        <TextField 
            margin="normal"
            fullWidth
            variant="standard"
            {...props}
        />
    )
}