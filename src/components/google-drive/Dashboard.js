import React from 'react'
import Navbar from './Navbar'
import { Container, Stack } from 'react-bootstrap'
import AddFolderButton from './AddFolderButton'
import { useFolder } from '../../hooks/useFolder'
import Folder from './Folder'
import { useParams, useLocation } from 'react-router-dom'
import FolderBreadcrumbs from './FolderBreadcrumbs'
import AddFileButton from './AddFileButton'
import File from './File'


export default function Dashboard() {
    const { folderId } = useParams()
    // getting state from links to render paths faster
    const { state = {} } = useLocation()

    const { folder, childFolders, childFiles } = useFolder(folderId, state && state.folder)
    return (
        <>
            <Navbar />
            <Container fluid>
                <Stack direction='horizontal' gap={2} className='align-items-center'>
                    <FolderBreadcrumbs currentFolder={folder} />
                    <AddFileButton currentFolder={folder} />
                    <AddFolderButton currentFolder={folder} />
                </Stack>

                {childFolders.length > 0 && (
                    <Stack direction="horizontal" className='flex-wrap'>
                        {childFolders.map(childFolder => {
                            return <div key={childFolder.id} className='p-2' style={{ maxWidth: '200px' }}>
                                <Folder folder={childFolder} />
                            </div>
                        })}
                    </Stack>
                )}
                {childFolders.length > 0 && childFiles.length > 0 && <hr />}
                {childFiles.length > 0 && (
                    <Stack direction="horizontal" className='flex-wrap'>
                        {childFiles.map(childFile => {
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
