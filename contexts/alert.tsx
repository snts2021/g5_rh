import { AlertColor } from "@material-ui/core"
import { createContext, useState } from "react"

interface AlertContextType {
    message: string
    type: AlertColor | undefined
    createAlert(message: string, type: string): void
    setMessage(message: string): void
}

export const AlertContext = createContext({  } as AlertContextType)


const AlertProvider:React.FC = ({ children }) => {

    const [type, setType] = useState()
    const [message, setMessage] = useState('')

    function createAlert(newMessage: string, type: any) {
        setMessage(newMessage)
        setType(type)
    }

    return (
        <AlertContext.Provider value={{ message: message, type, createAlert, setMessage }} >
            { children }
        </AlertContext.Provider>
    )
}

export { AlertProvider }