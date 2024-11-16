import React, { useState } from "react";
import {
  FaHome,
  FaUsers,
  FaChalkboardTeacher,
  FaBars,
  FaSchool,
  FaUserTie,
  FaUser,
  FaColumns, // Layouting icon
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logo from "../Assets/fundi_logo.png";
import "../styles/sidebar.css";
import Footer from "./Footer";

const Sidebar = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Define menu items and active route check
  const menuItems = [
    { path: "/", label: "Dashboard", icon: <FaHome /> },
    { path: "/primary", label: "Primary", icon: <FaChalkboardTeacher /> },
    { path: "/secondary", label: "Secondary", icon: <FaChalkboardTeacher /> },
    { path: "/dearday", label: "DEAR Day", icon: <FaBars /> },
    { path: "/admins", label: "Admins", icon: <FaUsers /> },
    { path: "/teachers", label: "Teachers", icon: <FaUserTie /> },
    { path: "/schools", label: "Schools", icon: <FaSchool /> },
    { path: "/profile", label: "Profile", icon: <FaUser /> },
  ];

  // Toggle sidebar state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`menu ${isSidebarOpen ? "open" : "collapsed"}`}>
      <div className="logo-container">
        {isSidebarOpen && (
          <div className="logo">
            <Link to="/" className="logo-link">
              <img className="logo-icon" src={logo} alt="fb_logo" />
            </Link>
          </div>
        )}

        {/* Layouting Icon for Sidebar Toggle */}
        <div className="toggle-button" onClick={toggleSidebar}>
          <FaColumns /> {/* Layouting icon */}
        </div>
      </div>

      {/* Menu Items */}
      <div className="menu-list">
        {menuItems.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className={`item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <span className="icon">{item.icon}</span>
            {isSidebarOpen && <span className="label">{item.label}</span>}
          </Link>
        ))}
      </div>

      {/* Footer */}
      {isSidebarOpen && (
        <div className="footer-container">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
