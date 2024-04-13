import React from 'react';
import './sidebar.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ProfileIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';

function Sidebar({  handlePageChange }) {
  return (
    <div className='control' >
      <div className="restaurant-profile">
        <h2>SKILLSYNC</h2>
      </div>
      <div className="list">
        <ul className="restaurant-management">
          <li tabIndex="0" className="restaurant-element">
            <Link tabIndex="0" onClick={() => handlePageChange('Dashboard')}>
              <DashboardIcon className="custom-icon" /> <span> Dashboard</span>
            </Link>
          </li>
          <li className="restaurant-element">
            <Link tabIndex="0" onClick={() => handlePageChange('Session')}>
              <EventIcon className="custom-icon" /> <span> Session</span>
            </Link>
          </li>
          <li className="restaurant-element">
            <Link tabIndex="0" onClick={() => handlePageChange('School')}>
              <SchoolIcon className="custom-icon" /> <span> Achievements</span>
            </Link>
          </li>
          <li className="restaurant-element">
            <Link tabIndex="0" onClick={() => handlePageChange('Schedule')}>
              <ScheduleIcon className="custom-icon" /> <span> Schedule</span>
            </Link>
          </li>
          <li className="restaurant-element">
            <Link tabIndex="0" onClick={() => handlePageChange('Profile')}>
              <ProfileIcon className="custom-icon" /> <span> Profile</span>
            </Link>
          </li>
        </ul>
        <ul className="restaurant-management">
          <li className="restaurant-element" id="logout">
            <Link tabIndex="0">
              <LogoutIcon className="custom-icon" /><span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
