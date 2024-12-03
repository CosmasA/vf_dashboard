import React from "react";
import { FaUserCircle, FaHome, FaArrowUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import Team from "./Team";
import Card from "./Card";
import Tabletscharts from "../Charts/Tabletscharts";

const Dashboard = () => {
  // Function to scroll to the top

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
    </div>
  );
};

export default Dashboard;
