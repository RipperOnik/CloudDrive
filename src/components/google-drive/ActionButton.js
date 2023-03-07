import React from 'react'
import { Button, Stack } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



export default function ActionButton({ icon, onClick, children }) {
    return <Stack gap={2} direction='horizontal' onClick={onClick} className="w-100 action-button">
        <FontAwesomeIcon icon={icon} style={{ width: "30px" }} />
        {children}
    </Stack>

}
