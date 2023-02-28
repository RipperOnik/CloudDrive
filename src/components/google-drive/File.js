import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { Overlay, Popover, ButtonGroup } from 'react-bootstrap'
import { useState, useRef } from 'react'
import "../../styles/popover.css"
import { database } from '../../firebase'
import { storageManager } from '../../firebase'
import ActionButton from './ActionButton'

export default function File({ file }) {
    const [show, setShow] = useState(false);
    const target = useRef(null);
    function handleRightClick(e) {
        e.preventDefault()
        setShow(true)
    }
    function handleRemove() {
        database.files.remove(file.id)
        storageManager.delete(file.fileStoragePath)
    }

    return (
        <>
            <a href={file.url} target="_blank" className='btn btn-outline-dark text-truncate w-100' onContextMenu={handleRightClick} ref={target}>
                <FontAwesomeIcon icon={faFile} style={{ marginRight: "8px" }} />
                {file.name}
            </a>
            <Overlay target={target.current} show={show} placement="right" rootClose onHide={() => setShow(false)}>
                <Popover className="popover-shadow">
                    <ButtonGroup vertical>
                        <ActionButton icon={faTrashCan} onClick={handleRemove}>
                            Remove
                        </ActionButton>
                    </ButtonGroup>
                </Popover>
            </Overlay>
        </>

    )
}

