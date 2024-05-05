// Panel.js
import React, { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import ControlPanel from '../components/controls/ControlPanel';
import Navbar from '../components/navbar/Navbar';
import './panel.css';

function Panel() {
    const [selectedPage, setSelectedPage] = useState('Profile');

    const handlePageChange = (page) => {
        setSelectedPage(page);
    };

    return (
        <>
            <Navbar selectedPage={selectedPage} handlePageChange={handlePageChange} />
            <div className="panel">
                <Sidebar selectedPage={selectedPage}  handlePageChange={handlePageChange}/>
                <ControlPanel selectedPage={selectedPage} />
            </div>
        </>
    );
}

export default Panel;

