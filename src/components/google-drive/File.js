import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan, faEdit } from "@fortawesome/free-regular-svg-icons"
import { Overlay, Popover, ButtonGroup } from 'react-bootstrap'
import { useState, useRef } from 'react'
import "../../styles/popover.css"
import { database, storageManager } from '../../firebase'
import ActionButton from './ActionButton'
import RenameModal from './RenameModal'

export default function File({ file }) {
    const [showPopover, setShowPopover] = useState(false);
    const target = useRef(null);
    const [showModal, setShowModal] = useState(false)
    const inputRef = useRef(null)

    function handleRightClick(e) {
        e.preventDefault()
        setShowPopover(true)
    }
    function closeModal() {
        setShowModal(false)
    }
    function closePopover() {
        setShowPopover(false)
    }
    function handleRemove() {
        database.files.remove(file.id)
        storageManager.delete(file.fileStoragePath)
        closePopover()
    }
    function openRenameModal() {
        closePopover()
        setShowModal(true)
    }
    function handleRename(e) {
        e.preventDefault()
        closeModal()
        database.files.update(file.id, { name: inputRef.current.value })
    }

    return (
        <>
            <a href={file.url} target="_blank" className='btn btn-outline-dark text-truncate w-100' onContextMenu={handleRightClick} ref={target}>
                <FontAwesomeIcon icon={faFile} style={{ marginRight: "8px" }} />
                {file.name}
            </a>
            <Overlay target={target.current} show={showPopover} placement="right" rootClose onHide={closePopover}>
                <Popover className="popover-shadow">
                    <ButtonGroup vertical>
                        <ActionButton icon={faTrashCan} onClick={handleRemove}>
                            Remove
                        </ActionButton>
                        <ActionButton icon={faEdit} onClick={openRenameModal}>
                            Rename
                        </ActionButton>
                    </ButtonGroup>
                </Popover>
            </Overlay>
            <RenameModal show={showModal} closeModal={closeModal} onSubmit={handleRename} defaultValue={file.name} inputRef={inputRef} />

        </>

    )
}

