import React, { useEffect, useRef, useState } from 'react'
import { divideFileName } from './File'
import "../../styles/detail.css"


export default function Details({ element, setShowDetails, showDetails }) {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (showDetails) {
      setWidth(ref.current.getBoundingClientRect().height)
    } else {
      setWidth(0)
    }
  }, [showDetails])

  if (element) {
    const [fileName, fileExtension] = divideFileName(element.name)
    const isFile = element.url
    const size = convertSize(element.size)
    const createdAt = defineDate(element.createdAt)
    return (
      <div className='details' style={{ width: width, padding: showDetails ? '15px' : '0' }}>
        <div ref={ref}>
          <div className='details-header'>
            <a href={element.url} target="_blank" className='details-file text-truncate d-flex align-items-center' style={{ gap: "8px", width: "200px" }}>
              <img src={isFile ? `./images/${element.type}.svg` : "./images/folder.svg"} alt="file" style={{ width: "35px" }} onError={(e) => e.target.src = "./images/file.svg"} />
              <div className='d-flex flex-grow-1 text-truncate'>
                <div className='text-truncate'>{isFile ? fileName : element.name}</div>
                {isFile && <span>{fileExtension}</span>}
              </div>
            </a>
            {showDetails && <button type='button' className='btn-close' style={{ width: "2px" }} onClick={() => setShowDetails(false)} />}
          </div>
          <div className='details-body'>
            <Detail name="Size" value={size} />
            <Detail name="Type" value={capitalize(isFile ? element.type : "folder")} />
            <Detail name="Created" value={createdAt} />
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className='details' style={{ width: width, padding: showDetails ? '15px' : '0' }}>
        <div ref={ref}>
          <div className='details-header justify-content-end'>
            {showDetails && <button type='button' className='btn-close' style={{ width: "2px" }} onClick={() => setShowDetails(false)} />}
          </div>
          <div className='details-body'>
            <div className='text-muted'>Select a file or folder to view its details</div>
            <img src="./images/view.svg" alt="view" />
          </div>
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




function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}