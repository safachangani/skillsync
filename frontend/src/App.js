import './App.css';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Signup from './components/forms/Signup';
import Login from './components/forms/Login'
// import Navbar from './components/navbar/Navbar';
import Sidebar from './components/sidebar/Sidebar';
import Dashboard from '@mui/icons-material/Dashboard';
import Panel from './pages/Panel';
import Home from './pages/Home';
import Post from './components/forms/Post';
import UpdateDetails from './components/updates/UpdateDetails';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/control-panel' element={<Panel/>}/>
        <Route path= '/home' element={<Home/>}/>
        <Route path= '/post-request-offer' element={<Post/>}/>
        <Route path= '/update/:id' element={<UpdateDetails/>}/>
      </Routes>
    </Router>
  )
}

export default App;
