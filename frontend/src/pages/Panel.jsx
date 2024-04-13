import React, { useState } from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import ControlPanel from '../components/controls/ControlPanal'
import './dashboard.css';
function Panel() {
    const [selectedPage,setSelectedPage]=useState('Dashboard')

    const handlePageChange=(page)=>{
      setSelectedPage(page)
    }
  

  return (
    <>
      <Sidebar handlePageChange={handlePageChange}/>
      <ControlPanel selectedPage={selectedPage} />
    </>
  )
}

export default Panel
