// Dashboard.js
import React, { useState } from 'react';
import Sidebar from "../components/sidebar/Sidebar";
import ControlPanel from "../components/controls/ControlPanal";
import Navbar from "../components/navbar/Navbar";
import './dashboard.css';

const Dashboard = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    const handleSidebarToggle = () => {
        setSidebarExpanded(!sidebarExpanded);
    };

    const handlePageChange = (page) => {
        // Define your logic for handling page changes here
    };

    return (
        <div className="dashboard">
            <Sidebar expanded={sidebarExpanded} handlePageChange={handlePageChange} />
            <div className={`content ${sidebarExpanded ? 'sidebar-expanded' : ''}`}>
                <Navbar handleSidebarToggle={handleSidebarToggle} />
                <ControlPanel handleSidebarToggle={handleSidebarToggle}/>
            </div>
        </div>
    );
};

export default Dashboard;
