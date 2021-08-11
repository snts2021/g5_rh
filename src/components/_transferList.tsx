import { Box, Button, Checkbox, List, ListItem, Paper } from "@material-ui/core"
import { useState } from "react"

function customList(items, checked, setChecked, prop) {
    return (
        <Paper sx={{ width: '100%', height: '100%', maxHeight: '50vh', overflow: 'auto' }}>
            <List 
                dense
                component="div"
                role="list"
            >
                {
                    items.map( (item, index) => {
                        return(
                            <ListItem button key={index} onClick={() => {
                                if(checked.includes(item.id)){
                                    let newArr = checked.slice(0)
                                    newArr.splice(newArr.indexOf(item.id), 1)
                                    return setChecked([...newArr])
                                }

                                return setChecked([...checked, item.id])
                            }}>
                                <Checkbox checked={checked.indexOf(item.id) !== -1} 

                                />    
                                {item[prop]}
                            </ListItem>
                        )
                    })
                }
            </List>
        </Paper>
    )
}

export function TransferList({ leftList, rightList, setRightList, setLeftList, prop }){
    
    const [checked, setChecked] = useState<any[]>([])
    
    function handleCheckedAllRight(){
        setRightList([...rightList, ...leftList])
        setLeftList([])
    }
   
    function handleCheckedAllLeft(){
        setLeftList([...leftList, ...rightList])
        setRightList([])
    }

    function handleCheckedRight(){
        const newRight: any = []
        leftList.forEach(item => {
            if(checked.includes(item.id)){
                newRight.push(item)
            }
        })

        const newLeft = leftList.slice(0).filter( item => (!checked.includes(item.id)) && item )

        setLeftList(newLeft)

        setRightList([...rightList, ...newRight])
        setChecked([])
    }

    function handleCheckedLeft(){
        const newLeft: any = []
        rightList.forEach(item => {
            if(checked.includes(item.id)){
                newLeft.push(item)
            }
        })
        const newRight = rightList.slice(0).filter( item => (!checked.includes(item.id)) && item )

        setLeftList([...leftList, ...newLeft])
        setRightList(newRight)
        setChecked([])
    }

    return( 
        <Box component="div" sx={{ display: 'grid', gap: 1, marginTop: 4, width: '100%', gridTemplateColumns: '2fr 1fr 2fr', justifyContent: 'center', alignItems: 'center'}}> 
            {customList(leftList, checked, setChecked, prop)}
            <Box component="div" sx={{ display: 'flex', gap: 2, width: '100%', alignItems: 'center', flexDirection: 'column' }} >
                <Box sx={{ maxWidth: 20, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center'}}>
                    <Button variant="outlined" size="small" fullWidth onClick={handleCheckedAllRight}>
                        ≫
                    </Button>
                    <Button size="small" variant="outlined" fullWidth onClick={handleCheckedRight} >
                        &gt;
                    </Button>
                    <Button size="small" variant="outlined" fullWidth onClick={handleCheckedLeft} >
                        &lt;
                    </Button>
                    <Button size="small" variant="outlined" fullWidth onClick={handleCheckedAllLeft} >
                        ≪
                    </Button>
                </Box>
            </Box>
            {customList(rightList, checked, setChecked, prop)}
        </Box>
    )
}