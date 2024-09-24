import React, { useState } from "react";
import {
  FaHome,
  FaUsers,
  FaChalkboardTeacher,
  FaBars,
  FaSchool,
  FaUserTie,
  FaMoon,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link for navigation
import logo from "../Assets/fb.png";
import "../styles/sidebar.css";
import Footer from "./Footer";

const Sidebar = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Function to toggle between dark and light themes
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.classList.toggle("dark-theme", !isDarkTheme);
  };

  return (
    <div className="menu">
      {/* Logo Section with Link to Dashboard */}
      <div className="logo">
        <Link to="/" className="logo-link">
          {" "}
          {/* Add Link around the logo and brand name */}
          <img
            className="logo-icon"
            src={logo}
            style={{
              width: "3rem",
              height: "3rem",
            }}
            alt="fb_logo"
          />
          <h4 className="brand-name">VirtualFundi</h4>
        </Link>
      </div>

      {/* Menu List */}
      <div className="menu-list">
        <Link to="/" className="item">
          <FaHome className="icon" />
          Dashboard
        </Link>
        <Link to="/primary" className="item">
          <FaChalkboardTeacher className="icon" />
          Primary
        </Link>
        <Link to="/secondary" className="item">
          <FaChalkboardTeacher className="icon" />
          Secondary
        </Link>
        <Link to="/dearday" className="item">
          <FaBars className="icon" />
          DEAR Day
        </Link>
        <Link to="/admins" className="item">
          <FaUsers className="icon" />
          Admins
        </Link>
        <Link to="/teachers" className="item">
          <FaUserTie className="icon" />
          Teachers
        </Link>
        <Link to="/schools" className="item">
          <FaSchool className="icon" />
          Schools
        </Link>
        <Link to="/profile" className="item">
          <FaUser className="icon" />
          Profile
        </Link>
      </div>
      <div
        className="theme-toggle"
        style={{ textAlign: "center", marginTop: "auto" }}
      >
        <Footer />
      </div>
    </div>
  );
};

export default Sidebar;
