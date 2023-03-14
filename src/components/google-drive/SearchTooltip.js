import React from 'react'
import { Stack } from 'react-bootstrap'
import "../../styles/navbar.css"


export default function SearchTooltip({ target, width, show, children }) {
    return (
        <div className='search-tooltip flex-grow-1'>
            {target}
            <div className='search-tooltip-body' style={{
                visibility: show ? 'visible' : 'hidden',
                width: `${width}px`
            }}>
                <Stack className='w-100'>
                    {children}
                </Stack>
            </div>
        </div>

    )
}
