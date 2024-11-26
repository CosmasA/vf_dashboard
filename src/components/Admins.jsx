import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaListUl, FaHome } from "react-icons/fa";
import axios from "axios";

const Admins = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://161.97.81.168:8080/admins/");
        setAdmins(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <section className="content-header">
        <h4>System Administrators</h4>
        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="#">
                <FaHome className="breadcrumb-icon" />
                Home
              </Link>
            </li>
            <li className="active">Admins</li>
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
      <div className="head">
        <Link to={"#"}>
          <FaListUl className="icon" />
          View Admins
        </Link>
        |
        <Link>
          <FaPlus className="icon" />
          Add Admin
        </Link>
      </div>
      <div className="table-container"></div>
    </div>
  );
};

export default Admins;
