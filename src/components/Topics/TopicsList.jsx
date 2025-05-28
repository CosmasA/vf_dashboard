import React, { useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table } from "react-bootstrap";

const TopicsList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get("https://fbappliedscience.com/api/");
        const sortedData = response.data.sort((a, b) => {
          // Sort by classTaught in alphabetical order
          return a.classTaught.localeCompare(b.classTaught);
        });
        setData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchTopics();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Link
          to="/vf_dashboard/"
          style={{
            textDecoration: "none",
            color: "#526d82",
            fontWeight: "bold",
            alignSelf: "end",
          }}
        >
          Close
        </Link>
        <h4>List of all Topics</h4>
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
