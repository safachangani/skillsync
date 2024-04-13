import Navbar from '../navbar/Navbar';
// import RestaurantProfile from '../restaurant-profile/RestaurantProfile';
// import './restaurant-panel.css'
function ControlPanel({handleSidebarToggle}) {
  return (
    <div className='restaurent-panel'> 
      <Navbar/>
      
      {/* {selectedPage==='Dashboard' && <></>}
      {selectedPage==='Order' && <RestaurantOrder  />}
      {selectedPage==='Menu' && <RestaurantMenu/>}
      {selectedPage==='Profile' && <RestaurantProfile/>} */}
      <div></div>
    </div>
  );
}

export default ControlPanel