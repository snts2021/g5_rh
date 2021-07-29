const Form:React.FC<any> = (props) => {
    return (
        <form {...props}></form>
    )
}

type serializeReturn = {
    fields: any
    emptyFields: string[]
    form: FormData
}

const serialize = (event: any): serializeReturn => {
    event.preventDefault()
    const form = new FormData(event.target)

    const fields:any = Object.fromEntries(form.entries())
    const emptyFields: string[] = []

    for (var prop in fields) {
        let value 
        value = fields[prop]
    

        if (!value) emptyFields.push(prop)
    }
    return { fields, emptyFields, form }
}

export { Form, serialize }