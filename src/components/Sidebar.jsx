import React from "react";
import {
  FaHome,
  FaUsers,
  FaChalkboardTeacher,
  FaBars,
  FaSchool,
  FaUserTie,
  FaUser,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logo from "../Assets/fb.png";
import "../styles/sidebar.css";
import Footer from "./Footer";

const Sidebar = () => {
  const location = useLocation();

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

  return (
    <div className="menu">
      <div className="logo">
        <Link to="/" className="logo-link">
          <img className="logo-icon" src={logo} alt="fb_logo" />
          <h4 className="brand-name">VirtualFundi</h4>
        </Link>
      </div>

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
            <span className="label">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Conditionally render the footer based on screen width */}
      <div className="footer-container">
        <Footer />
      </div>
    </div>
  );
};

export default Sidebar;
