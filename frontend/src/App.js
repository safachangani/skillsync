import './App.css';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Signup from './components/forms/Signup';
import Login from './components/forms/Login'
// import Navbar from './components/navbar/Navbar';
import Panel from './pages/Panel';
import Home from './pages/Home';
import Post from './components/forms/Post';
import UpdateDetails from './components/updates/UpdateDetails';
import PostDetails from './pages/PostDetails';
import EditProfile from './components/forms/EditProfile';
import Profile from './components/controls/Profile';
import BrowseProfiles from './components/updates/BrowseProfiles';
import ClassAllocation from './components/forms/ClassAllocation';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/control-panel' element={<Panel/>}/>
        <Route path= '/home' element={<Home/>}/>
        <Route path= '/post-request-offer' element={<Post/>}/>
        <Route path= '/update/:id' element={<PostDetails/>}/>
        <Route path= '/edit-profile' element={<EditProfile/>}/>
        <Route path= '/profile' element={<Profile/>}/>
        <Route path= '/browse-profiles' element={<BrowseProfiles/>}/>
        <Route path= '/form-announcement' element={<ClassAllocation/>}/>



      </Routes>
    </Router>
  )
}

export default App;
