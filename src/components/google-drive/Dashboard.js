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
                <Stack direction='horizontal' gap={2} className='align-items-center mb-4'>
                    <FolderBreadcrumbs currentFolder={folder} />
                    <AddFileButton currentFolder={folder} />
                    <AddFolderButton currentFolder={folder} />
                </Stack>
                <div className='mb-2'>Folders</div>
                {childFolders.length > 0 && (
                    <Stack direction="horizontal" className='flex-wrap'>
                        {childFolders.map(childFolder => {
                            return <Folder folder={childFolder} key={childFolder.id} />

                        })}
                    </Stack>
                )}
                {childFolders.length > 0 && childFiles.length > 0 && <hr />}
                <div className='mb-2'>Files</div>
                {childFiles.length > 0 && (
                    <Stack direction="horizontal" className='flex-wrap' gap={3}>
                        {childFiles.map(childFile => {
                            return <File file={childFile} key={childFile.id} />
                        })}
                    </Stack>
                )}
            </Container>
        </>

    )
}
