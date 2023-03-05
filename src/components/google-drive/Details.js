import React from 'react'
import { divideFileName } from './File'
import "../../styles/detail.css"
import { useFolder } from '../../hooks/useFolder'


export default function Details({ element, setShowDetails }) {

  const { allFolders, allFiles } = useFolder()

  if (element) {
    const [fileName, fileExtension] = divideFileName(element.name)
    const isFile = element.url
    const size = isFile ? convertSize(element.size) : convertSize(calculateFolderSize(element.id, allFolders, allFiles))
    const createdAt = defineDate(element.createdAt)
    return (
      <div className='details'>
        <div className='details-header'>
          <a href={element.url} target="_blank" className='details-file text-truncate d-flex align-items-center' style={{ gap: "8px", width: "200px" }}>
            <img src={isFile ? `./images/${element.type}.svg` : "./images/folder.svg"} alt="file" style={{ width: "35px" }} onError={(e) => e.target.src = "./images/file.svg"} />
            <div className='d-flex flex-grow-1 text-truncate'>
              <div className='text-truncate'>{isFile ? fileName : element.name}</div>
              {isFile && <span>{fileExtension}</span>}
            </div>
          </a>
          <button type='button' className='btn-close' style={{ width: "2px" }} onClick={() => setShowDetails(false)} />
        </div>
        <div className='details-body'>
          <Detail name="Size" value={size} />
          <Detail name="Type" value={capitalize(isFile ? element.type : "folder")} />
          <Detail name="Created" value={createdAt} />
        </div>
      </div>
    )
  }


}

function Detail({ name, value }) {
  return <div>
    <div>{name}</div>
    <div className='text-muted'>{value}</div>
  </div>
}

function convertSize(size) {
  let counter = 0
  while (size >= 1024) {
    size /= 1024
    counter++
  }
  let appendage = "B"
  switch (counter) {
    case 1:
      appendage = "KB"
      break
    case 2:
      appendage = "MB"
      break
    case 3:
      appendage = "GB"
      break

    default:
      break;
  }
  size = Math.round(size)
  return `${size} ${appendage}`
}

function defineDate(dateStr) {
  const date = new Date(dateStr)
  const curDate = new Date()
  const months = { 0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr", 4: "May", 5: "Jun", 6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec" }
  if (date.getFullYear() === curDate.getFullYear()) {
    if (date.getDate() === curDate.getDate() && date.getMonth() === curDate.getMonth()) {
      return "Today"
    }
    return `${date.getDate()} ${months[date.getMonth()]}`
  } else {
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }
}


function calculateFolderSize(folderId, folders, files) {
  if (folders && files) {
    let sum = 0
    for (let i = 0; i < files.length; i++) {
      if (files[i].folderId === folderId) {
        sum += files[i].size
      }
    }
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].parentId === folderId) {
        sum += calculateFolderSize(folders[i].id, folders, files)
      }
    }
    return sum
  }
  return 0
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}