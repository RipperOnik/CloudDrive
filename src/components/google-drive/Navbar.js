import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import "../../styles/search.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import SearchTooltip from './SearchTooltip'
import SearchResult from './SearchResult'

export default function NavbarComponent() {
    const [text, setText] = useState('')
    const [width, setWidth] = useState(0)
    const target = useRef()
    const [show, setShow] = useState(false)

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
        if (text.length > 0) {
            console.log(`searching for ${text}`)
        }
    }
    const debouncedSearch = useRef(debouncer(search))

    useEffect(() => {
        debouncedSearch.current(text)
    }, [text])


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
    }, [target.current])

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
            closeTooltip()
        }

        // select the current item
        if (key === "Enter") {
            // take current element with activeIndex
            // check if it is a file or folder
            // if it is a folder, use navigate
            // else, use window.open("URL", "_blank");
            console.log('enter')
        }

    }
    const [activeIndex, setActiveIndex] = useState(-1)

    const elements = [{ name: 'folder' }, { url: 'https://www.youtube.com/', name: 'file' }]





    return (
        <Navbar bg="white" expand="sm">
            <Container fluid>
                <Navbar.Brand as={Link} to="/">
                    Drive
                </Navbar.Brand>
                <form className='form-search' onSubmit={handleSearch}>
                    <SearchTooltip
                        show={show}
                        width={target.current ? target.current.offsetWidth : 0}
                        target={<input type="search" width={width} ref={target} placeholder='Search in Drive' onChange={e => setText(e.target.value)} value={text} onClick={() => setShow(true)} onBlur={() => setTimeout(closeTooltip, 10)} onKeyDown={handleKeyDown} />}>
                        {elements.map((element, index) => {
                            return <SearchResult element={element} activeIndex={activeIndex} setActiveIndex={setActiveIndex} index={index} />
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
