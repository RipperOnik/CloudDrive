import React from 'react'
import { Button, Stack } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



export default function ActionButton({ icon, onClick, children }) {
    return <Button variant='light' style={{ width: "250px" }} onClick={onClick}>
        <Stack gap={2} direction='horizontal'>
            <FontAwesomeIcon icon={icon} style={{ width: "30px" }} />
            {children}
        </Stack>
    </Button>
}
