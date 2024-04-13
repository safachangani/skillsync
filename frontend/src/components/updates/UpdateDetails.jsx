import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './user-details.css'
function UpdateDetails() {
  const location = useLocation();
  const updateData = location.state?.data;
  console.log(updateData);
  return (   
        <div className='update-data' >
          <span>{updateData.tab}</span>
          <h2>{updateData.heading}</h2>
          <p>{updateData.description}</p>
          <Link  className="view-details-link">Accept</Link>
        </div>
  )
}

export default UpdateDetails
