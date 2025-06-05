import React, { useState ,useEffect} from 'react'
import Navbar from '../components/navbar/Navbar'
import Update from '../components/updates/Update'
import './home.css'
import Welcome from '../components/updates/Welcome'
import Search from '../components/browse/Search'
import Post from '../components/forms/Post'
import axios from '../axios'
function Home() {
  const [showPostPopup,setShowPostPopup] =useState();
  const [isProfileComplete,setIsProfileComplete] = useState(false);
  
  const openPostPopup = ()=>setShowPostPopup(true);
  const closePostPopup = ()=>{
    setShowPostPopup(false);
    window.location.reload();
  }
  useEffect(() => {
    const token = localStorage.getItem('user-token');
    axios.get('/check-profile-data',{
      headers:{
        Authorization:`Bearer ${token}`
      }
    }).then(res=>{
        console.log(res,"profile");
        setIsProfileComplete(res.data.profileExists);
        
    }).catch((err)=>{
        console.log(err);
        
    })
    if (showPostPopup) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => document.body.classList.remove('no-scroll');
  }, [showPostPopup]);

  return (
    <div className='home'>
        <Navbar openPostPopup={openPostPopup} /> {/* pass function to Navbar */}
        <Welcome isProfileComplete={isProfileComplete} openPostPopup={openPostPopup}/>
        <Search/>
        <Update/>

        {showPostPopup && <Post onClose={closePostPopup} />} {/* conditional popup */}
    </div>
  )
}

export default Home
