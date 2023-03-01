import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import "../../styles/search.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export default function NavbarComponent() {
    const [text, setText] = useState('')


    function debouncer(originalFunction) {
        let timeout = null
        return (...args) => {
            if (timeout !== null) {
                clearTimeout(timeout)
            }
            timeout = setTimeout(() => {
                originalFunction(...args)
            }, 400)
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
    return (
        <Navbar bg="white" expand="sm">
            <Container fluid>
                <Navbar.Brand as={Link} to="/">
                    Drive
                </Navbar.Brand>
                <form className='form-search' onSubmit={handleSearch}>
                    <input type="search" placeholder='Search in Drive' onChange={e => setText(e.target.value)} value={text} />
                    <button type='submit'>
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" style={{ color: "grey" }} />
                    </button>
                </form>
                <Nav>
                    <Nav.Link as={Link} to="/user">
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}
