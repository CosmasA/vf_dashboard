import React, { useState, useEffect } from "react";
import { FaUserCircle, FaHome, FaArrowUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import Team from "./Team";
import Card from "./Card";
import Tabletscharts from "../Charts/Tabletscharts";

const Dashboard = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      console.log("Scroll event triggered");
      console.log("Current scroll position:", window.scrollY); // Log scroll position
      if (window.scrollY > 40) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const goTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="dashboard-container">
      <section className="content-header">
        <h4>Welcome to VirtualFundi!</h4>
        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="#">
                <FaHome className="breadcrumb-icon" />
                Home
              </Link>
            </li>
            <li className="active">Dashboard</li>
          </ol>
        </nav>
      </section>

      <div className="team-container">
        <Card />
        <Tabletscharts />
        <Team />
      </div>

      {/* Scroll-to-top button */}
      {showTopBtn && (
        <div className="go-top" onClick={goTop}>
          <FaArrowUp className="arrow-icon" />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
