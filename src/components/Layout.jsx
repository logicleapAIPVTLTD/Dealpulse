import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppBar from './AppBar';
import Sidebar from './Sidebar'; // Import the new Sidebar

export default function Layout() {
  // Add state to manage the sidebar's visibility
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Function to toggle the state
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="page">
      {/* Pass the state and function to the Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* The main content area */}
      <div className="main-container">
        {/* Pass the toggle function to the AppBar */}
        <AppBar toggleSidebar={toggleSidebar} />
        <main>
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}