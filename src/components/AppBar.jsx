import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './AppBar.css';

// The AppBar receives the `toggleSidebar` function as a prop
export default function AppBar({ toggleSidebar }) {
  return (
    <header className="app-bar">
      <div className="app-bar-left">
        {/* Hamburger Menu Button */}
        <button className="menu-btn" onClick={toggleSidebar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        {/* Logo links to the home page */}
        <Link to="/" className="logo">
          IntelliDeal AI
        </Link>
        <span className="live-indicator">LIVE</span>
      </div>
      <div className="app-bar-right">
        {/* RESTORED: Navigation links for switching pages */}
        <nav className="main-nav">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/stream">Stream</NavLink>
        </nav>

        {/* RESTORED: Notification Bell */}
        <button className="notification-bell">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <span className="notification-badge">18</span>
        </button>

        {/* RESTORED: User Profile Menu */}
        <div className="user-profile-menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>Anonymous User</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>
    </header>
  );
}