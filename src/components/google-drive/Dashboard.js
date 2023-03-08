import React, { useState, useRef, useEffect } from 'react'
import Navbar from './Navbar'
import { Container, Stack } from 'react-bootstrap'
import AddFolderButton from './AddFolderButton'
import { useFolder } from '../../hooks/useFolder'
import Folder from './Folder'
import { useParams, useLocation } from 'react-router-dom'
import FolderBreadcrumbs from './FolderBreadcrumbs'
import AddFileButton from './AddFileButton'
import File from './File'
import Details from './Details'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faEdit, faCircleQuestion, faHeart } from "@fortawesome/free-regular-svg-icons"
import { faHeartBroken } from '@fortawesome/free-solid-svg-icons'
import "../../styles/dashboard.css"
import { database, storageManager } from '../../firebase'
import RenameModal from "./RenameModal"
import { useAuth } from '../../contexts/AuthContext'
import SideBar from './SideBar'
import FilterDropdown from './FilterDropdown'

export const filters = { DATE: "date", NAME: "name", SIZE: "size" }


export default function Dashboard() {
    const { folderId } = useParams()
    // getting state from links to render paths faster
    const { state = {} } = useLocation()

    const { currentUser } = useAuth()
    const { query } = useParams()

    const [chosenFilter, setChosenFilter] = useState(filters.DATE)
    const [isASC, setIsASC] = useState(true)


    const isSearch = typeof query !== 'undefined'
    const isFavorites = window.location.href.includes("favorites")


    const { folder, childFolders, childFiles, allFolders, allFiles } = useFolder(folderId, state && state.folder)


    let folders = childFolders
    let files = childFiles
    if (isFavorites) {
        folders = allFolders.filter(f => f.isFavorite)
        files = allFiles.filter(f => f.isFavorite)
    } else if (isSearch) {
        folders = allFolders.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
        files = allFiles.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    }
    function sortFunc(a, b) {
        if (chosenFilter === filters.DATE) {
            if (isASC) {
                return new Date(a.createdAt) - new Date(b.createdAt)
            } else {
                return new Date(b.createdAt) - new Date(a.createdAt)
            }
        }
        else if (chosenFilter === filters.NAME) {
            if (isASC) {
                return a.name.localeCompare(b.name)
            } else {
                return b.name.localeCompare(a.name)
            }
        }

        else if (chosenFilter === filters.SIZE) {
            if (isASC) {
                return a.size - b.size
            } else {
                return b.size - a.size
            }
        }
    }

    folders.sort(sortFunc)
    files.sort(sortFunc)



    const [activeIndex, setActiveIndex] = useState(-1)
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
    function toggleDetails(e) {
        e.stopPropagation()
        setShowDetails(prev => !prev)
    }
    function resetActiveIndex() {
        setActiveIndex(-1)
    }
    useEffect(() => {
        document.body.addEventListener('click', resetActiveIndex)
        return () => {
            document.body.removeEventListener('click', resetActiveIndex)
        }
    }, [])

    function toggleFavFile(e) {
        e.stopPropagation()
        const file = elements[activeIndex]
        database.files.toggleFav(file.id, file.isFavorite)
    }
    function toggleFavFolder(e) {
        e.stopPropagation()
        const folder = elements[activeIndex]
        database.folders.toggleFav(folder.id, folder.isFavorite)
    }





    return (
        <div>
            <Navbar resetActiveIndex={resetActiveIndex} currentFolder={folder} />
            <div className='d-flex w-100' style={{ gap: "10px" }}>
                <SideBar folders={allFolders} resetActiveIndex={resetActiveIndex} />
                <div className='flex-grow-1' style={{ paddingRight: "15px" }}>
                    <Stack direction='horizontal' gap={2} className={`align-items-center pb-2 pt-2 ${(isSearch || isFavorites) ? 'justify-content-between' : ''}`} style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.2)", height: "65px" }}>
                        {isSearch && <div>Search results for {query}</div>}
                        {isFavorites && "Favorites"}
                        {!isSearch && !isFavorites && <FolderBreadcrumbs currentFolder={folder} resetActiveIndex={resetActiveIndex} />}
                        {elements[activeIndex] && <Stack direction='horizontal' gap={1} style={{ borderLeft: "1px solid rgba(0, 0, 0, 0.2)", padding: "0 10px" }}>
                            <FontAwesomeIcon icon={faTrashCan} className="circular-button" onClick={handleRemove} />
                            <FontAwesomeIcon icon={faEdit} className="circular-button" onClick={() => setShowModal(true)} />
                            <FontAwesomeIcon icon={faCircleQuestion} className="circular-button" onClick={toggleDetails} />
                            <FontAwesomeIcon icon={elements[activeIndex].isFavorite ? faHeartBroken : faHeart} className="circular-button" onClick={elements[activeIndex].url ? toggleFavFile : toggleFavFolder} />
                        </Stack>}
                        {!isSearch && !isFavorites && <AddFileButton currentFolder={folder} />}
                        {!isSearch && !isFavorites && <AddFolderButton currentFolder={folder} />}
                    </Stack>
                    <div className='d-flex' onClick={resetActiveIndex}>
                        <div style={{ padding: "15px 15px 15px 0", position: "relative" }} className="flex-grow-1">
                            <FilterDropdown style={{ position: "absolute", top: "5px", right: "0" }} chosenFilter={chosenFilter} setChosenFilter={setChosenFilter} isASC={isASC} setIsASC={setIsASC} />
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
                                        const newIndex = childFolders.length + index
                                        return <File file={childFile} key={childFile.id} activeIndex={activeIndex} setActiveIndex={setActiveIndex} index={newIndex} setShowDetails={setShowDetails} />
                                    })}
                                </Stack>
                            )}
                        </div>
                        {showDetails && <Details element={elements[activeIndex]} setShowDetails={setShowDetails} />}
                    </div>
                </div>

            </div>
            <RenameModal show={showModal} closeModal={() => setShowModal(false)} onSubmit={handleRename} defaultValue={elements[activeIndex] && elements[activeIndex].name} inputRef={inputRef} />
        </div>

    )
}
