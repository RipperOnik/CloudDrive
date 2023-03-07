import React, { useState } from 'react'
import { Collapse, Container, Stack } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { faFolder, faHeart } from '@fortawesome/free-regular-svg-icons'
import { v4 as uuidV4 } from 'uuid'
import { ROOT_FOLDER } from '../../hooks/useFolder'
import { useNavigate } from 'react-router-dom'
import "../../styles/sidebar.css"


export default function SideBar({ folders, resetActiveIndex }) {
    const navigate = useNavigate()
    function getAllFolders(folder) {
        if (folders) {
            const isRoot = folder.id === null
            const children = folders.filter(childFolder => childFolder.parentId === folder.id)
            const childFolders = children.map(childFolder => getAllFolders(childFolder))

            function click() {
                if (isRoot) {
                    navigate('/')
                    resetActiveIndex()

                } else {
                    navigate(`/folder/${folder.id}`, { state: { folder: folder } })
                    resetActiveIndex()
                }

            }

            return <Collapsable icon={isRoot ? faFolder : "folder"} name={isRoot ? "All files" : folder.name} key={folder.id} onClick={click}>
                {childFolders.length > 0 && childFolders}
            </Collapsable>
        }
    }

    if (folders) {
        return (
            <div className='sidebar flex-shrink-0'>
                {getAllFolders(ROOT_FOLDER)}
                <Collapsable icon={faHeart} name={"Favorite"} />
            </div>
        )
    }

}



function Collapsable({ icon, name, children, onClick }) {
    const isSvg = typeof icon === 'string'
    const [isOpen, setIsOpen] = useState(false)
    const id = uuidV4()
    function toggle(e) {
        e.stopPropagation()
        setIsOpen(prev => !prev)
    }
    function open(e) {
        e.stopPropagation()
        setIsOpen(true)
        onClick()
    }
    return (<>
        <div className='collapsable'>
            <Stack direction='horizontal' gap={2} onClick={open}>
                {children && <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} size="xs" onClick={toggle} aria-expanded={isOpen} aria-controls={id} className="chevron" />}
                {isSvg ? <img src={`./images/${icon}.svg`} alt="icon" style={{ width: "20px" }} /> : <FontAwesomeIcon icon={icon} style={{ width: "20px" }} />}
                <div className='text-truncate'>{name}</div>
            </Stack>
        </div>

        <Collapse in={isOpen}>
            <div id={id} style={{ paddingLeft: "15px" }}>
                {children}
            </div>
        </Collapse>
    </>)

}
