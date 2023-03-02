import React from 'react'
import Navbar from './Navbar'
import { Container, Stack } from 'react-bootstrap'
import { useFolder } from '../../hooks/useFolder'
import Folder from './Folder'
import { useParams } from 'react-router-dom'
import File from './File'

export default function SearchPage() {
    const { query } = useParams()
    const { allFiles, allFolders } = useFolder()
    const folders = allFolders && allFolders.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    const files = allFiles && allFiles.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))

    return (
        <>
            <Navbar />
            <Container fluid>
                <h3 className='m-2'>Search results for {query}</h3>
                {folders && folders.length > 0 && (
                    <Stack direction="horizontal" className='flex-wrap'>
                        {folders.map(childFolder => {
                            return <div key={childFolder.id} className='p-2' style={{ maxWidth: '200px' }}>
                                <Folder folder={childFolder} />
                            </div>
                        })}
                    </Stack>
                )}
                {folders && files && folders.length > 0 && files.length > 0 && <hr />}
                {files && files.length > 0 && (
                    <Stack direction="horizontal" className='flex-wrap'>
                        {files.map(childFile => {
                            return <div key={childFile.id} className='p-2' style={{ maxWidth: '200px' }}>
                                <File file={childFile} />
                            </div>
                        })}
                    </Stack>
                )}
            </Container>
        </>
    )
}
