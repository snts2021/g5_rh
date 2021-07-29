/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Chip, IconButton, Menu, MenuItem, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Tooltip, Typography } from "@material-ui/core"
import { useEffect, useRef, useState } from "react"
import { MdCompareArrows, MdFilterList, MdSwapHoriz } from "react-icons/md"
interface iGridProps {
    titles: any[]
    tableData: any[]
    setData(newValues: any[]): void
    noFilter?: boolean
    ignoreFilter?: string[]
    loading?: boolean
    children: any
    itemsPerPage?: number
}

const Grid = ({ titles, tableData, setData, noFilter=false, ignoreFilter=[], loading=false, itemsPerPage=5, children }: iGridProps) => {

    const [order, setOrder] = useState<any>('null')
    const [orderBy, setOrderBy] = useState<string>('Nome')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage)
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null)
    const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false)
    const [isCombined, setIsCombined] = useState<boolean>(false)
    const [selectedFilters, setSelectedFilters] = useState<any[]>([])

    const filterOptions = useRef<any[]>([])
    const defaultData =   useRef<any[]>([])

    const onRequestSort = (property: any) => {
        if(property !== orderBy) {
            setOrderBy(property)
            return setOrder('desc')
        }
        switch (order) {
            case 'desc':
                setOrder('asc')
                setOrderBy(property)
                break
            case 'null':
                setOrder('desc')
                setOrderBy(property)
                break
            case 'asc':
                setOrder('null')
                setOrderBy('')
                break
        }
    }

    function handleSort(dados: any[]){
        let sortable = dados.slice(0)
        if(order === 'null') return setData(sortable)
        sortable.sort( (a, b) => {
            var x = a[orderBy]
            var y = b[orderBy]
        
            return x < y ? -1 : x > y ? 1 : 0 
        })
        setData((order === 'asc') ? sortable : sortable.reverse())
    }

    function handleOpenFilter(event: any, formattedTitle: string){
        filterOptions.current = []
        
        if (formattedTitle.includes('.')) {
            const path = formattedTitle.split('.')
            defaultData.current.forEach( item => {
                if(!filterOptions.current.includes(item[path[0]][path[1]]) && item[path[0]][path[1]] ){
                    const newArr = filterOptions.current
                    newArr.push(item[path[0]][path[1]])
                    return filterOptions.current = newArr
                }
            })
        }else{
            defaultData.current.forEach( item => {
                if(!filterOptions.current.includes(item[formattedTitle]) && item[formattedTitle] ){
                    const newArr = filterOptions.current
                    newArr.push(item[formattedTitle])
                    return filterOptions.current = newArr
                }
            })
        }
        setAnchorElement(event.currentTarget)
        setIsFilterVisible(true)
    }

    function handleCloseFilter(filter: string){
        let newFilters = selectedFilters.slice(0)
        newFilters.splice(newFilters.indexOf(filter), 1)
        setSelectedFilters(newFilters)
    }

    function handleSelectFilter(filter: string){
        const newFilters = selectedFilters.slice(0)
        if(newFilters.includes(filter)) return 0
        newFilters.push(filter)
        setIsFilterVisible(false)
        setSelectedFilters([...newFilters])
    }

    useEffect(() => {
        if(selectedFilters.length < 1){
            const newArr = defaultData.current.slice(0)
            setData(newArr)
            defaultData.current = newArr 
            return 
        }

        const newArr = defaultData.current.slice(0)
        const filteredArr:any[] = []
        if(isCombined) {
            newArr.forEach(item => {
                let filterSatisfied: string[] = []
                Object.entries(item).forEach(([, value]) => {
                    if(typeof value === 'object' && value) {
                        Object.entries(value).forEach(([, sub]) => {
                            if(selectedFilters.indexOf(sub) > -1) 
                                filterSatisfied.push(selectedFilters[selectedFilters.indexOf(sub)])
                        })
                    }
                    if(selectedFilters.indexOf(value) > -1) 
                        filterSatisfied.push(selectedFilters[selectedFilters.indexOf(value)])
                })
                if (JSON.stringify(filterSatisfied.sort()) === JSON.stringify(selectedFilters.slice(0).sort()))
                    filteredArr.push(item)
            })
        }else {
            newArr.forEach( item => {
                Object.entries(item).forEach(([, value]) => {
                    if(typeof value === 'object' && value) {
                        Object.entries(value).forEach(([, sub]) => {
                            if(selectedFilters.includes(sub)) filteredArr.push(item)
                        })
                    }else if(selectedFilters.includes(value)) return filteredArr.push(item)
                })
            })
        }
        handleSort(filteredArr)

    }, [selectedFilters, isCombined])

    useEffect(() => {
        if (defaultData.current.length < 1) defaultData.current = tableData
        if(tableData.length > rowsPerPage) defaultData.current = defaultData.current
    }, [tableData])

    useEffect(() => {
        if(defaultData.current.length < 1) return
        const dados = defaultData.current.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        handleSort(dados)
    }, [ defaultData.current, page, rowsPerPage])
    
    useEffect(() => {
        const dados = defaultData.current.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        handleSort(dados)
    }, [order, orderBy])

    return (
        <>
        <TableContainer component={Paper}>
            {
                !noFilter &&
                (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', paddingY: 1, paddingLeft: 1}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton onClick={() => setIsCombined(!isCombined)} >
                                {
                                    isCombined 
                                    ? <MdCompareArrows />
                                    : <MdSwapHoriz />
                                }
                            </IconButton>
                            <Typography fontWeight="bold" variant="subtitle1" component="h4" >Filtrar por:</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {
                                selectedFilters.map( (item, index) => {
                                    return <Chip key={index} label={item} onDelete={() => handleCloseFilter(item)}/>
                                })
                            }
                        </Box>
                    </Box>
                )
            }
            <Table className="table" aria-label="a dense table" size="small" >
                <TableHead>
                   <Tr sx={{ backgroundColor: 'background.default' }}>
                        {
                            titles.map( (title, index) => {
                                
                                let formattedTitle = ''
                                if(title.name) formattedTitle = title.name
                                if(typeof title === 'string') formattedTitle = title.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().replace(/_/g, '_') 
                                return (
                                    <Td 
                                        key={index} 
                                        sortDirection={orderBy === formattedTitle ? order : false}
                                    >
                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                            {
                                                title &&
                                                <TableSortLabel 
                                                    onClick={() => onRequestSort(formattedTitle)}
                                                    active={orderBy === formattedTitle}
                                                    direction={orderBy === formattedTitle ? order : 'asc'}
                                                >
                                                    <Typography fontWeight="bold" component="p" variant='subtitle2'>
                                                        {title?.label || title}
                                                    </Typography>
                                                </TableSortLabel>
                                            }
                                            {
                                                (!ignoreFilter.includes(formattedTitle) && !noFilter && formattedTitle ) &&
                                                <Tooltip title="Filtrar coluna">
                                                    <IconButton 
                                                        onClick={
                                                            (event: any) => {
                                                                handleOpenFilter(event, formattedTitle)
                                                            }
                                                        } 
                                                        component="span" 
                                                        style={{width: 33, height: 33}} >
                                                        <MdFilterList />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                        </Box>
                                    </Td>
                                )
                            })
                        }
                   </Tr>
                </TableHead>
                <TableBody sx={{'& tr:nth-of-type(even)': { backgroundColor: 'background.default' }}}>
                    {
                        loading ? 
                        (
                            <Tr>
                            {
                                titles.map( (value, index) => {
                                    return  (
                                        <Td key={index}>
                                            <Box 
                                                sx={{ height: 20, borderRadius: '2px', overflow: 'hidden', width: '100%', position: 'relative', }}
                                           >
                                                <Skeleton variant="rectangular" animation="wave" width="100%" height="100%"/>
                                            </Box>
                                        </Td>
                                    )
                                })
                            }
                            </Tr>
                        )
                        :
                        <>
                            {children}
                        </>

                    }
                </TableBody>
            </Table>
                <TablePagination 
                    component="div" 
                    page={page} 
                    rowsPerPage={rowsPerPage} 
                    labelRowsPerPage="Linhas por página"
                    labelDisplayedRows={({from, to, count}) => `${from}-${to} de ${count}`}
                    rowsPerPageOptions={[5, 10, 25]} 
                    count={defaultData.current.length}  
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={event => setRowsPerPage(parseInt(event.target.value))} 
                />
        </TableContainer>
        <Menu
            sx={{maxHeight: 400}}
            anchorEl={anchorElement}
            open={isFilterVisible}
            onClose={() => setIsFilterVisible(false)}
            >
            {filterOptions.current.map( item => {
                return <MenuItem onClick={() => handleSelectFilter(item)} key={item}>{item}</MenuItem>
            } )}
        </Menu>
        </>
    )
}

export { Grid }

export const Tr = ({ children, ...props}) => {
    return (
        <TableRow {...props} hover>
            {children}
        </TableRow>
    )
}

export const Td = ({ children, ...props}) => {
    return (
        <TableCell {...props}>
            {children}
        </TableCell>
    )
}

export const Header = ({ title, children, ...props }) => {
    return (
        <Box component="header" sx={{ marginBottom: 2}} {...props}>
            <Typography fontWeight="bold" component="h1" variant="h5" sx={{marginBottom: 2}} >{title}</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
                {children} 
            </Box>
        </Box>
    )
}