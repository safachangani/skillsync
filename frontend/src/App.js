import './App.css';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Signup from './components/forms/Signup';
import Login from './components/forms/Login'
import Home from './pages/Home';
import Post from './components/forms/Post';
import ViewPostDetails from './pages/ViewPostDetails';
import EditProfile from './components/forms/EditProfile';
import Profile from './components/controls/Profile';
import BrowseProfiles from './components/updates/BrowseProfiles';
import MyProfile from './pages/MyProfile';
import PartnerMessages from './pages/PartnerMessages';
import MyPartnersList from './pages/MyPartnersList';
import ProfileDetail from './pages/ProfileDetail';

import RequireAuth from './components/RequireAuth';
import RequireNoAuth from './components/RequireNoAuth';
function App() {
  return (
    <Router>
      <Routes>    
        <Route path="/" element={<RequireNoAuth> <Login /></RequireNoAuth> } />
        <Route path="/signup"  element={<RequireNoAuth> <Signup /></RequireNoAuth>}/>
        {/* Protected pages – only for users with a valid token */}
        <Route path="/home" element={ <RequireAuth> <Home /></RequireAuth>} />
        <Route path="/post-request-offer" element={<RequireAuth><Post /></RequireAuth>}/>
        <Route path= '/update/:id' element={<ViewPostDetails/>}/>
        <Route path= '/edit-profile' element={<EditProfile/>}/>
        <Route path= '/profile' element={<Profile/>}/>
        <Route path= '/browse-profiles' element={<BrowseProfiles/>}/>
        <Route path='/my-partners' element={<PartnerMessages/>}/>
        <Route path='/my-profile' element={<MyProfile/>}/>
         <Route path='/my-partners-list' element={<MyPartnersList/>}/>
         <Route path="/profile-visit" element={<ProfileDetail />} />

      </Routes>
    </Router>
  )
}

export default App;
