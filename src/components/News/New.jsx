import React from 'react'
import './news.css'

const New = ({hading, useImg, paragraph, linkTo}) => {
  return (
    <>
        <div className="man_co">
            <div className="img">
                <img src={useImg} alt="News" />
            </div>
            <div className="para">
                <h1>{hading}</h1>
                <p>{paragraph}</p>
                <a href={linkTo} rel="noreferrer">ReadMore</a>
            </div>
        </div>
    </>
  )
}

export default New