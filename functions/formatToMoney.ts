function formatToMoney(value:number, symbolBeforeDot?: string, symbolAfterDot?: string): string{
    if(!symbolBeforeDot) 
        symbolBeforeDot =  '.'
    if(!symbolAfterDot) 
        symbolAfterDot =  ','
        
    let toString = `${value}`
    toString = toString.replace(/\./g, '')
    let valueBeforeDot:any = toString.slice(0, -2)
    let valueAfterDot = toString.slice(-2)
    valueBeforeDot = valueBeforeDot.split('').reverse()
    valueBeforeDot.forEach( (element:any, index: number) => {
        if(index%3 === 0 && index != 0) {
            valueBeforeDot[index] = `${valueBeforeDot[index]}${symbolBeforeDot}`
        } 
    })

    valueBeforeDot = valueBeforeDot.reverse().join('')
    if (valueAfterDot && valueAfterDot.length < 2 ) 
        valueAfterDot = `${valueAfterDot}0`
    return `${valueBeforeDot}${symbolAfterDot}${valueAfterDot || '00'}`
}

export {formatToMoney}