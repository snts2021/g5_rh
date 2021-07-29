import { Modal as ModalContainer } from "@material-ui/core"
import { Box } from "@material-ui/system"

export const Modal = ({ open, onClose, children }) => {
    return (
        <ModalContainer open={open} onClose={() => onClose(false) } disableEnforceFocus >
            <Box sx={{ outline: 'none' ,backgroundColor: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                {children}
            </Box>
        </ModalContainer>
    )
}