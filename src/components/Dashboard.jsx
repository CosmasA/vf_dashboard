import React from "react";
import { FaUserCircle, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import Team from "./Team";
import Card from "./Card";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <section className="content-header">
        <h2>Dashboard</h2>
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
      <hr
        style={{
          width: "100%",
          color: "#777",
          alignItems: "left",
          float: "left",
        }}
      ></hr>
      <div className="team-container">
        <Card />
        <Team />
      </div>
    </div>
  );
};

export default Dashboard;
