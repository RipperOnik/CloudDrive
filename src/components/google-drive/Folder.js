import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { Button, Overlay, Popover, ButtonGroup } from 'react-bootstrap'
import ActionButton from './ActionButton'
import { faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { database } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'




export default function Folder({ folder }) {
    const [show, setShow] = useState(false);
    const target = useRef(null);
    const { currentUser } = useAuth()
    function handleRightClick(e) {
        e.preventDefault()
        setShow(true)
    }
    function closePopover() {
        setShow(false)
    }
    function handleRemove() {
        database.folders.remove(folder.id, currentUser)
        closePopover()
    }
    return (
        <>
            <Button as={Link} to={`/folder/${folder.id}`} state={{ folder: folder }}
                variant="outline-dark" className='text-truncate w-100' ref={target} onContextMenu={handleRightClick}>
                <FontAwesomeIcon icon={faFolder} style={{ marginRight: "8px" }} />
                {folder.name}
            </Button>
            <Overlay target={target.current} show={show} placement="right" rootClose onHide={closePopover}>
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
