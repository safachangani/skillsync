import React from 'react'
import Navbar from '../components/navbar/Navbar'
import Update from '../components/updates/Update'
import './home.css'
function Home() {
  return (
    <div className='home'>
        <Navbar/>
        <Update/>
    </div>
  )
}

export default Home
