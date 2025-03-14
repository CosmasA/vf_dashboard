import { useState } from "react";
import {
  FaHome,
  FaUsers,
  FaChalkboardTeacher,
  FaBars,
  FaSchool,
  FaUserTie,
  FaUser,
  FaCog,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logo from "../../Assets/fb.png";
import toggle from "../../Assets/toggle.png";
import Footer from "./Footer";
import { Tooltip, OverlayTrigger } from "react-bootstrap"; // Import from react-bootstrap

const Sidebar = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Define menu items and active route check
  const menuItems = [
    { path: "/home", label: "Dashboard", icon: <FaHome /> },
    { path: "/primary", label: "Primary", icon: <FaChalkboardTeacher /> },
    { path: "/secondary", label: "Secondary", icon: <FaChalkboardTeacher /> },
    { path: "/dearday", label: "DEAR Day", icon: <FaBars /> },
    { path: "/admins", label: "Admins", icon: <FaUsers /> },
    { path: "/teachers", label: "Teachers", icon: <FaUserTie /> },
    { path: "/schools", label: "Schools", icon: <FaSchool /> },
    { path: "/accounts", label: "Settings", icon: <FaCog /> },
  ];

  // Toggle sidebar state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`menu ${isSidebarOpen ? "open" : "collapsed"} ${
        window.innerHeight <= 600 ? "short-height" : ""
      }`}
    >
      <div className="logo-container">
        {isSidebarOpen && (
          <div className="logo">
            <Link to="/" className="logo-link">
              <img className="logo-icon" src={logo} alt="fb_logo" />
              <span>
                <h6>VirtualFundi</h6>
              </span>
            </Link>
          </div>
        )}
        <div className="toggle-button" onClick={toggleSidebar}>
          <img className="toggle-icon" src={toggle} alt="toggle_button" />
        </div>
      </div>

      {/* Menu Items */}
      <div className="menu-list">
        {menuItems.map((item, index) => (
          <OverlayTrigger
            key={index}
            placement="right" // Tooltip position
            overlay={<Tooltip id={`tooltip-${index}`}>{item.label}</Tooltip>}
          >
            <Link
              to={item.path}
              className={`item ${isSidebarOpen ? "" : "toggled"} ${
                location.pathname.startsWith(item.path) ? "active" : ""
              }`}
            >
              <span className="icon">{item.icon}</span>
              {isSidebarOpen && <span className="label">{item.label}</span>}
            </Link>
          </OverlayTrigger>
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
