import React from "react";
import { useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table } from "react-bootstrap";

const TopicsList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get("http://161.97.81.168:8080/");
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchTopics();
  }, []);

  return (
    <div className="dashboard-container">
      <section className="content-header">
        <h2>List of all Topics</h2>
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
              <th>Topic Name</th>
              <th>Subject</th>
              <th>Class</th>
              <th>Term</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.topicName}</td>
                <td>{item.subject}</td>
                <td>{item.classTaught}</td>
                <td>{item.term}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default TopicsList;