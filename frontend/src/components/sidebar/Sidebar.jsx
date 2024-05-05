import React, { useState } from 'react';
import './sidebar.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ProfileIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';

function Sidebar({ handlePageChange }) {
    const [activePage, setActivePage] = useState('Profile');

    const changePage = (page) => {
        setActivePage(page);
        handlePageChange(page); // Call the function passed from the parent component
    };

    return (
        <div className='control'>
            <div className="restaurant-profile">
                {/* <h2>SKILLSYNC</h2> */}
            </div>
            <div className="list">
                <ul className="restaurant-management">
                    <li tabIndex="0" className={`restaurant-element ${activePage === 'Notifications' ? 'active' : ''}`}>
                        <Link tabIndex="0" onClick={() => changePage('Notifications')}>
                            <DashboardIcon className="custom-icon" /> <span> Notifications</span>
                        </Link>
                    </li>
                    <li className={`restaurant-element ${activePage === 'Partners' ? 'active' : ''}`}>
                        <Link tabIndex="0" onClick={() => changePage('Partners')}>
                            <EventIcon className="custom-icon" /><span> Partners</span>
                        </Link>
                    </li>
                    <li className={`restaurant-element ${activePage === 'Achievements' ? 'active' : ''}`}>
                        <Link tabIndex="0" onClick={() => changePage('Achievements')}>
                            <SchoolIcon className="custom-icon" /> <span> Achievements</span>
                        </Link>
                    </li>
                    <li className={`restaurant-element ${activePage === 'Schedule' ? 'active' : ''}`}>
                        <Link tabIndex="0" onClick={() => changePage('Schedule')}>
                            <ScheduleIcon className="custom-icon" /> <span> Schedule</span>
                        </Link>
                    </li>
                    <li className={`restaurant-element ${activePage === 'Profile' ? 'active' : ''}`}>
                        <Link tabIndex="0" onClick={() => changePage('Profile')}>
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
