import { Box, CircularProgress, TextField, Typography } from "@material-ui/core"
import React, { useRef, useState } from "react"
import { MdAttachFile } from "react-icons/md"


export const Input = ({ setProgress=(a)=>{}, ...props}) => {
    
    const [textFile, setTextFile] = useState('') 
    const [maskValue, setMaskValue] = useState('') 
    
    const fileInput = useRef<any>()
    
    function handleChange(){
        if(fileInput.current.value) {
            const name = fileInput.current.value.split('\\')
            setTextFile(`${name[name.length - 1]}`)
        }else {
            setTextFile('')
            setProgress(0)
        }
    }
    
    function filterValue(value: string){
        const {mask} = props
        if(mask.onlyNumber && value.match(/[a-z]/g)) return
        if(value.split('.').join('').length > mask.numbersAfterDot + mask.numbersBeforeDot) return
        if(value.includes(mask.separator)) {
            if(value.split(mask.separator).length > 2) return
            let [beforeDot, afterDot] = value.split(mask.separator)
            if(beforeDot.split('.').join('').length > mask.numbersBeforeDot) return
            if(afterDot.length > mask.numbersAfterDot) return
            beforeDot = beforeDot.split('.').join('').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
            return setMaskValue(`${beforeDot},${afterDot}`) 
        }
        setMaskValue(value.split('.').join('').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."))
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
                    borderBottom: '2px solid #2667ff',
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
                display: 'grid', 
                gap: 1, 
                paddingBottom: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
                gridTemplateColumns: '20px calc(100% - 60px) 20px'
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
                >
                    { textFile ? textFile : 'Selecionar arquivo'}
                </Typography>
                <CircularProgress size={20} variant="determinate" color="primary" value={props.progress || 0} />
                </Box>
            <input ref={fileInput} style={{ display: 'none' }} onChange={() => handleChange()} id={props.name} {...props}/>
            </Box>
            </Box>
        )

        if(props.mask) 
        return (
            <TextField 
            margin="normal"
            fullWidth
            variant="standard"
            {...props}
            value={maskValue}
            onChange={ ({target}) => filterValue(target.value)}
            
            />
        )
            
        return (
            <TextField 
            margin="normal"
            fullWidth
            variant="standard"
            // inputComponent={TextMaskCustom as any}
            {...props}
            />
        )
}