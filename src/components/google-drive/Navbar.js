import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import "../../styles/search.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import SearchTooltip from './SearchTooltip'
import SearchResult from './SearchResult'
import { useFolder } from '../../hooks/useFolder'

export default function NavbarComponent() {
    const [text, setText] = useState("")
    const [width, setWidth] = useState(0)
    const target = useRef()
    const [show, setShow] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)

    const { allFolders, allFiles } = useFolder()
    const navigate = useNavigate()
    const initialElements = useMemo(() => {
        return allFiles && allFolders && allFiles.concat(allFolders)
    }, [allFiles, allFolders])

    const [elements, setElements] = useState([])

    useEffect(() => {
        if (initialElements) {
            setElements(initialElements.filter(e => (text === "") || e.name.toLowerCase().includes(text.toLowerCase())))
        }
    }, [initialElements])


    function debouncer(originalFunction) {
        let timeout = null
        return (...args) => {
            if (timeout !== null) {
                clearTimeout(timeout)
            }
            timeout = setTimeout(() => {
                originalFunction(...args)
            }, 200)
        }
    }
    function search(text) {
        if (initialElements) {
            const newElements = initialElements.filter(e => (text === "") || e.name.toLowerCase().includes(text.toLowerCase()))
            setElements(newElements)
        }
    }
    const debouncedSearch = useMemo(() => debouncer(search), [initialElements])

    useEffect(() => {
        debouncedSearch(text)
    }, [text, debouncedSearch])


    function handleSearch(e) {
        e.preventDefault()
    }

    function closeTooltip() {
        setShow(false)
    }
    const myObserver = useMemo(() => new ResizeObserver(entries => {
        // this will get called whenever div dimension changes
        entries.forEach(entry => {
            setWidth(entry.contentRect.width)
        });
    }), [])

    useEffect(() => {
        myObserver.observe(target.current)
        return () => myObserver.disconnect()
    }, [myObserver])

    function onHideSearchTooltip() {
        setTimeout(closeTooltip, 10)
        setActiveIndex(-1)
    }
    function handleKeyDown(e) {
        const { key } = e;

        // move down
        if (key === "ArrowDown") {
            setActiveIndex(prev => (prev + 1) % elements.length)
        }

        // move up
        if (key === "ArrowUp") {
            setActiveIndex(prev => (prev + elements.length - 1) % elements.length)
        }

        // hide search results
        if (key === "Escape") {
            target.current.blur()
        }

        // select the current item
        if (key === "Enter") {
            e.preventDefault()
            target.current.blur()
            if (activeIndex >= 0) {
                const isFile = typeof elements[activeIndex].url !== 'undefined'
                if (isFile) {
                    window.open(elements[activeIndex].url, "_blank")
                } else {
                    navigate(`/folder/${elements[activeIndex].id}`)
                }
            } else {
                // go to search dashboard
                if (text.length > 0) {
                    navigate(`/search/${text}`)
                }
            }
            closeTooltip()
        }

    }

    return (
        <Navbar bg="white" expand="sm">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className='d-flex align-items-center' style={{ gap: "10px" }}>
                    <img src="./images/cloud.svg" alt="logo" width={40} height={40} />
                    Drive
                </Navbar.Brand>
                <form className='form-search' onSubmit={handleSearch}>
                    <SearchTooltip
                        show={show}
                        width={target.current ? target.current.offsetWidth : 0}
                        target={<input type="search" width={width} ref={target} placeholder='Search in Drive' onChange={e => setText(e.target.value)} value={text} onClick={() => setShow(true)} onBlur={onHideSearchTooltip} onKeyDown={handleKeyDown} />}>
                        {elements && elements.slice(0, 7).map((element, index) => {
                            return <SearchResult element={element} activeIndex={activeIndex} setActiveIndex={setActiveIndex} index={index} key={element.id} />
                        })}
                    </SearchTooltip>

                    <button type='submit' className='button-search'>
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" style={{ color: "grey" }} />
                    </button>
                </form>

                <Nav>
                    <Nav.Link as={Link} to="/user">
                        Profile
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )

}



