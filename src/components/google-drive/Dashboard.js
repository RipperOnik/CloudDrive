import React, { useState, useRef, useEffect, useMemo } from 'react'
import Navbar from './Navbar'
import { Offcanvas, Stack } from 'react-bootstrap'
import AddFolderButton from './AddFolderButton'
import { useFolder } from '../../hooks/useFolder'
import Folder from './Folder'
import { useParams, useLocation } from 'react-router-dom'
import FolderBreadcrumbs from './FolderBreadcrumbs'
import AddFileButton from './AddFileButton'
import File from './File'
import Details from './Details'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faEdit, faCircleQuestion, faHeart, faSave } from "@fortawesome/free-regular-svg-icons"
import { faHeartBroken } from '@fortawesome/free-solid-svg-icons'
import "../../styles/dashboard.css"
import { database, storageManager } from '../../firebase'
import RenameModal from "./RenameModal"
import { useAuth } from '../../contexts/AuthContext'
import SideBar from './SideBar'
import FilterDropdown from './FilterDropdown'
import ElementBreadcrumbs from './ElementBreadcrumbs'
import DetailsMobile from './DetailsMobile'
import { divideFileName } from './File'

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
    const elementToRename = useRef(null)


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
        const element = elementToRename.current
        const fullFileName = inputRef.current.value + activeFileExtension
        if (element.url) {
            if (element.name !== fullFileName) {
                database.files.update(element.id, { name: fullFileName })
            }
        }
        else {
            if (element.name !== inputRef.current.value) {
                database.folders.update(element.id, { name: inputRef.current.value }, currentUser)
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


    const mainRef = useRef(null)
    useEffect(() => {
        const resetClickElement = mainRef.current
        resetClickElement.addEventListener('click', resetActiveIndex)
        return () => {
            resetClickElement.removeEventListener('click', resetActiveIndex)
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
    function handleEdit(e) {
        e.stopPropagation()
        elementToRename.current = elements[activeIndex]
        setShowModal(true)
    }


    function handleDownload() {
        storageManager.download(elements[activeIndex].url, elements[activeIndex].name)
    }

    const [showDetailsMobile, setShowDetailsMobile] = useState(false)

    function openDetailsMobile(e) {
        e.stopPropagation()
        setShowDetailsMobile(true)
    }

    const [activeFileName, activeFileExtension] = divideFileName(elements[activeIndex] ? elements[activeIndex].name : '')









    return (
        <div className='h-100 d-flex flex-column' style={{ minHeight: '0', overflow: 'hidden' }}>
            <Navbar resetActiveIndex={resetActiveIndex} />
            <div className='d-flex w-100 flex-grow-1 main-content' style={{ gap: "10px", overflow: 'hidden', minHeight: '0', minWidth: '0' }}>
                <SideBar folders={allFolders} resetActiveIndex={resetActiveIndex} currentFolder={folder} />
                <div className='d-flex flex-grow-1' onClick={resetActiveIndex} style={{ minHeight: '0', overflow: 'hidden', gap: "20px" }}>
                    <div className='d-flex flex-grow-1 flex-column main-content-items' style={{ minHeight: '0', overflow: 'hidden', padding: "15px", gap: "10px" }}>
                        <Stack direction='horizontal' className={`${(!isSearch && !isFavorites) ? 'justify-content-end' : ''}`}>
                            {isSearch && <div style={{ fontSize: "24px" }} className='flex-grow-1'>Search results</div>}
                            {isFavorites && <div style={{ fontSize: "24px" }} className='flex-grow-1'>Favorites</div>}
                            {elements[activeIndex] && <Stack direction='horizontal' gap={1} style={{ borderRight: "1px solid rgba(0, 0, 0, 0.2)", paddingRight: "5px" }}>
                                <FontAwesomeIcon icon={faTrashCan} className="circular-button" onClick={handleRemove} />
                                <FontAwesomeIcon icon={faEdit} className="circular-button" onClick={handleEdit} />
                                {elements[activeIndex].url && <FontAwesomeIcon icon={faSave} className="circular-button" onClick={handleDownload} />}
                                <FontAwesomeIcon icon={elements[activeIndex].isFavorite ? faHeartBroken : faHeart} className="circular-button" onClick={elements[activeIndex].url ? toggleFavFile : toggleFavFolder} />
                                <FontAwesomeIcon icon={faCircleQuestion} className="circular-button d-md-none" onClick={openDetailsMobile} />
                            </Stack>}
                            <FontAwesomeIcon icon={faCircleQuestion} className="circular-button d-none d-md-block" onClick={toggleDetails} aria-controls='collapsed-details' aria-expanded={showDetails} style={{ marginLeft: "5px" }} />
                        </Stack>


                        <div style={{ position: "relative", width: "100%", overflow: 'auto', flexGrow: '1' }} ref={mainRef}>
                            <FilterDropdown style={{ position: "absolute", top: "0", right: "0" }} chosenFilter={chosenFilter} setChosenFilter={setChosenFilter} isASC={isASC} setIsASC={setIsASC} />
                            {folders && folders.length > 0 && <div className='mb-4'>Folders</div>}
                            {folders && folders.length > 0 && (
                                <Stack direction="horizontal" className='flex-wrap mb-4' gap={3}>
                                    {folders.map((childFolder, index) => {
                                        return <Folder folder={childFolder} key={childFolder.id} activeIndex={activeIndex} setActiveIndex={setActiveIndex} index={index} setShowDetails={setShowDetails} />
                                    })}
                                </Stack>
                            )}

                            {files && files.length > 0 && <div className='mb-4'>Files</div>}
                            {files && files.length > 0 && (
                                <Stack direction="horizontal" className='flex-wrap' gap={3}>
                                    {files.map((childFile, index) => {
                                        const newIndex = folders.length + index
                                        return <File file={childFile} key={childFile.id} activeIndex={activeIndex} setActiveIndex={setActiveIndex} index={newIndex} setShowDetails={setShowDetails} />
                                    })}
                                </Stack>
                            )}
                        </div>
                        {elements[activeIndex] && (isSearch || isFavorites) && <ElementBreadcrumbs element={elements[activeIndex]} resetActiveIndex={resetActiveIndex}
                            style={{ borderTop: "1px solid rgba(0, 0, 0, 0.2)", padding: "0 15px" }} />}
                        {!isSearch && !isFavorites && <FolderBreadcrumbs currentFolder={folder} resetActiveIndex={resetActiveIndex}
                            style={{ borderTop: "1px solid rgba(0, 0, 0, 0.2)", padding: "0 15px" }} />}
                    </div>
                    <Details element={elements[activeIndex]} setShowDetails={setShowDetails} showDetails={showDetails} />
                </div>

            </div>
            <RenameModal show={showModal} closeModal={() => setShowModal(false)} onSubmit={handleRename}
                defaultValue={elements[activeIndex] && (elements[activeIndex].url ? activeFileName : elements[activeIndex].name)} inputRef={inputRef} />
            <Offcanvas show={showDetailsMobile} onHide={() => setShowDetailsMobile(false)} placement='end'>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Details</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <DetailsMobile element={elements[activeIndex]} />
                </Offcanvas.Body>
            </Offcanvas>
        </div>

    )
}
