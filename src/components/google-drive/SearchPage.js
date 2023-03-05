import React, { useState, useRef } from 'react'
import Navbar from './Navbar'
import { Container, Stack } from 'react-bootstrap'
import { useFolder } from '../../hooks/useFolder'
import Folder from './Folder'
import { useParams } from 'react-router-dom'
import File from './File'
import { database, storageManager } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import Details from './Details'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faEdit, faCircleQuestion } from "@fortawesome/free-regular-svg-icons"
import RenameModal from './RenameModal'


export default function SearchPage() {
    const { query } = useParams()
    const { allFiles, allFolders } = useFolder()
    const folders = allFolders && allFolders.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    const files = allFiles && allFiles.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    const [activeIndex, setActiveIndex] = useState(-1)
    const { currentUser } = useAuth()



    const elements = folders ? folders.concat(files) : []
    const [showDetails, setShowDetails] = useState(false)

    const [showModal, setShowModal] = useState(false)
    const inputRef = useRef(null)


    function handleRemoveFile() {
        database.files.remove(elements[activeIndex].id)
        storageManager.delete(elements[activeIndex].fileStoragePath)
    }
    function handleRemoveFolder() {
        database.folders.remove(elements[activeIndex].id, currentUser)
    }

    function handleRename(e) {
        e.preventDefault()
        setShowModal(false)
        if (elements[activeIndex].url) {
            if (elements[activeIndex].name !== inputRef.current.value) {
                database.files.update(elements[activeIndex].id, { name: inputRef.current.value })
            }
        }
        else {
            if (elements[activeIndex].name !== inputRef.current.value) {
                database.folders.update(elements[activeIndex].id, { name: inputRef.current.value }, currentUser)
            }
        }

    }
    function handleRemove() {
        if (elements[activeIndex].url) {
            handleRemoveFile()
        } else {
            handleRemoveFolder()
        }
    }
    function toggleDetails() {
        setShowDetails(prev => !prev)
    }


    return (
        <>
            <Navbar />
            <Container fluid>
                <Stack direction='horizontal' gap={2} className='align-items-center pb-2 pt-2 justify-content-between' style={{ borderTop: "1px solid rgba(0, 0, 0, 0.2)", borderBottom: "1px solid rgba(0, 0, 0, 0.2)", height: "65px" }}>
                    <div>Search results for {query}</div>
                    {elements[activeIndex] && <Stack direction='horizontal' gap={1} style={{ padding: "0 10px" }}>
                        <FontAwesomeIcon icon={faTrashCan} className="circular-button" onClick={handleRemove} />
                        <FontAwesomeIcon icon={faEdit} className="circular-button" onClick={() => setShowModal(true)} />
                        <FontAwesomeIcon icon={faCircleQuestion} className="circular-button" onClick={toggleDetails} />
                    </Stack>}
                </Stack>
                <div className='d-flex' onClick={() => setActiveIndex(-1)}>
                    <Container fluid style={{ padding: "15px 15px 15px 0" }}>
                        {folders && folders.length > 0 && <div className='mb-2'>Folders</div>}
                        {folders && folders.length > 0 && (
                            <Stack direction="horizontal" className='flex-wrap mb-4' gap={3}>
                                {folders.map((childFolder, index) => {
                                    return <Folder folder={childFolder} key={childFolder.id} activeIndex={activeIndex} setActiveIndex={setActiveIndex} index={index} setShowDetails={setShowDetails} />

                                })}
                            </Stack>
                        )}

                        {files && files.length > 0 && <div className='mb-2'>Files</div>}
                        {files && files.length > 0 && (
                            <Stack direction="horizontal" className='flex-wrap' gap={3}>
                                {files.map((childFile, index) => {
                                    const newIndex = folders.length + index
                                    return <File file={childFile} key={childFile.id} activeIndex={activeIndex} setActiveIndex={setActiveIndex} index={newIndex} setShowDetails={setShowDetails} />
                                })}
                            </Stack>
                        )}
                    </Container>
                    {showDetails && <Details element={elements[activeIndex]} setShowDetails={setShowDetails} />}
                </div>
            </Container>
            <RenameModal show={showModal} closeModal={() => setShowModal(false)} onSubmit={handleRename} defaultValue={elements[activeIndex] && elements[activeIndex].name} inputRef={inputRef} />
        </>
    )
}
