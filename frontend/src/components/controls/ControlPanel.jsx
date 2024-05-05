import Notification from '../navbar/Notification'
import Navbar from '../navbar/Navbar';
import Profile from './Profile';
import Partners from './Partners';
import ClassAllocationPage from './ClassAllocationPage';
import './control-panel.css'
function ControlPanel({selectedPage}) {
  return (
    <div className='control-panel'> 
  
      
       {/* {selectedPage==='Dashboard' && <></> */}
      {selectedPage==='Notifications' && <Notification/>}
      {selectedPage==='Schedule' && <ClassAllocationPage/>}
      {selectedPage==='Partners' && <Partners/>} 
      {selectedPage==='Profile' && <Profile/>}
      <div></div>
    </div>
  );
}

export default ControlPanel