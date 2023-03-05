import React from 'react'
import { faTrashCan, faEdit, faCircleQuestion, faSave } from "@fortawesome/free-regular-svg-icons"
import { Overlay, Popover, ButtonGroup } from 'react-bootstrap'
import { useState, useRef } from 'react'
import "../../styles/popover.css"
import { database, storageManager } from '../../firebase'
import ActionButton from './ActionButton'
import RenameModal from './RenameModal'
import "../../styles/file.css"

export default function File({ file, index, activeIndex, setActiveIndex, setShowDetails }) {
    const [showPopover, setShowPopover] = useState(false);
    const target = useRef(null);
    const [showModal, setShowModal] = useState(false)
    const inputRef = useRef(null)
    const [fileName, fileExtension] = divideFileName(file.name)

    const isActive = index === activeIndex

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
    function handleClick(e) {
        e.stopPropagation()
        if (e.detail === 1) {
            setActiveIndex(index)
        }
        else if (e.detail === 2) {
            window.open(file.url, "_blank")
        }
    }
    function openDetails() {
        setShowDetails(true)
        setActiveIndex(index)
        closePopover()
    }


    return (
        <>
            <div className={`file text-truncate d-flex align-items-center ${isActive ? "file--active" : ''}`} onContextMenu={handleRightClick} ref={target}
                style={{ gap: "8px", width: "200px", cursor: "pointer", display: "inline-block" }} onClick={handleClick}
            >
                <img src={`./images/${file.type}.svg`} alt="file" style={{ width: "25px" }} onError={(e) => e.target.src = "./images/file.svg"} />
                <div className='d-flex flex-grow-1 text-truncate'>
                    <div className='text-truncate'>{fileName}</div>
                    <span>{fileExtension}</span>
                </div>
            </div>
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
                        <ActionButton icon={faCircleQuestion} onClick={openDetails}>
                            Show details
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


