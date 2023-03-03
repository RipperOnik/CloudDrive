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
                <h4 className='mb-4'>Search results for {query}</h4>
                {folders && folders.length > 0 && <div className='mb-2'>Folders</div>}
                {folders && folders.length > 0 && (
                    <Stack direction="horizontal" className='flex-wrap' gap={3}>
                        {folders.map(childFolder => {
                            return <Folder folder={childFolder} key={childFolder.id} />
                        })}
                    </Stack>
                )}
                {folders && files && folders.length > 0 && files.length > 0 && <hr />}
                {files && files.length > 0 && <div className='mb-2'>Files</div>}
                {files && files.length > 0 && (
                    <Stack direction="horizontal" className='flex-wrap' gap={3}>
                        {files.map(childFile => {
                            return <File file={childFile} key={childFile.id} />
                        })}
                    </Stack>
                )}
            </Container>
        </>
    )
}
