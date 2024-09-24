import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import axios from "axios";

const Secondary = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://161.97.81.168:8080/viewSecTopics/"
        );
        setData(response.data);
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
        <h2>Secondary Section</h2>
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
      <div className="table-container">
        <Table striped bordered hover className="table">
          <thead>
            <tr>
              <th className="actions">Code</th>
              <th>Topic Name</th>
              <th>Class</th>
              <th>Term</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((topic) => (
              <tr key={topic.id}>
                <td>{topic.topicCode}</td>
                <td>{topic.topicName}</td>
                <td>{topic.classTaught}</td>
                <td>{topic.term}</td>
                <td className="actions">
                  <Button variant="warning">Edit</Button>
                  <Button variant="info">Sessions</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Secondary;
