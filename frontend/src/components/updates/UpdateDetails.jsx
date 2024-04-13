import React from 'react'
import { Link } from 'react-router-dom'
import './user-details.css'
function UpdateDetails() {
  return (   
        <div className='update-details' >
          <span>Request</span>
          <h2>Heading</h2>
          <p>detailed description</p>
          <Link  className="view-details-link">Accept</Link>
        </div>
  )
}

export default UpdateDetails
