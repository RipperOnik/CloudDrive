import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'


export default function SearchResult({ activeIndex, element, setActiveIndex, index }) {
    const active = activeIndex === index

    function handleMouseEnter() {
        setActiveIndex(index)
    }
    function handleMouseLeave() {
        setActiveIndex(-1)
    }


    if (element.url) {
        return <a
            className='d-flex w-100 align-items-center search-result'
            target="_blank"
            href={element.url}
            style={{ backgroundColor: active ? 'rgba(0, 0, 0, 0.12)' : '' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <FontAwesomeIcon icon={faFile} style={{ marginRight: '15px' }} />
            <span className='text-truncate'>{element.name}</span>

        </a>
    } else {
        return <Link
            className='d-flex w-100 align-items-center search-result'
            to={`/folder/${element.id}`}
            style={{ backgroundColor: active ? 'rgba(0, 0, 0, 0.12)' : '' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <FontAwesomeIcon icon={faFolder} style={{ marginRight: '10px' }} />
            <span className='text-truncate'>{element.name}</span>
        </Link>
    }



}
