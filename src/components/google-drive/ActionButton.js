import React from 'react'
import { Stack } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



export default function ActionButton({ icon, onClick, children }) {
    return <Stack gap={2} direction='horizontal' onClick={onClick} className="w-100 action-button">
        {icon && (typeof icon === 'string' ? <img src={`./images/${icon}.svg`} alt='action button' width={20} /> : <FontAwesomeIcon icon={icon} style={{ width: "30px" }} />)}
        {children}
    </Stack>
}
