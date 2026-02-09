import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navLinks = [
    { path: "/doc-intelligence", text: "Document Intelligence System" },
    { path: "/matching", text: "Buyer-Seller Matching" },
    { path: "/", text: "Market Intelligence" }, // Assuming this links to the dashboard
    { path: "/legal", text: "NCLT & Legal Monitoring" },
    { path: "/prediction", text: "Deal Flow Prediction" },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      {/* The overlay will cover the screen and close the sidebar when clicked */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={toggleSidebar}
      ></div>
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Navigation</h3>
        </div>
        <ul className="sidebar-links">
          {navLinks.map(link => (
            <li key={link.path}>
              <NavLink to={link.path} onClick={toggleSidebar}>
                {link.text}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}