import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan, faEdit, faSave } from "@fortawesome/free-regular-svg-icons"
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
    const [fileName, fileExtension] = divideFileName(file.name)

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
        if (file.name !== inputRef.current.value) {
            database.files.update(file.id, { name: inputRef.current.value })
        }
    }
    function handleDownload() {
        closePopover()
        storageManager.download(file.url, file.name)
    }

    return (
        <>
            <a href={file.url} target="_blank" className='btn btn-outline-dark text-truncate d-flex align-items-center' onContextMenu={handleRightClick} ref={target} style={{ gap: "8px", width: "200px" }}>
                <FontAwesomeIcon icon={faFile} />
                <div className='d-flex flex-grow-1 text-truncate'>
                    <div className='text-truncate'>{fileName}</div>
                    <span>{fileExtension}</span>
                </div>
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
                        <ActionButton icon={faSave} onClick={handleDownload}>
                            Download
                        </ActionButton>
                    </ButtonGroup>
                </Popover>
            </Overlay>
            <RenameModal show={showModal} closeModal={closeModal} onSubmit={handleRename} defaultValue={file.name} inputRef={inputRef} />

        </>

    )
}
export function divideFileName(fullFileName) {
    for (let i = fullFileName.length - 1; i >= 0; i--) {
        const code = fullFileName.charCodeAt(i)
        if (code === 46) {
            return [fullFileName.slice(0, i), fullFileName.slice(i)]
        }
    }
    return fullFileName
}


