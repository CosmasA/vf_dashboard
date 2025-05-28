import React from "react";
import { useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table } from "react-bootstrap";

const ThemeLists = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await axios.get(
          "https://fbappliedscience.com/api/viewTheme/"
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchThemes();
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
        <h4>List of the Themes</h4>
        <Table striped bordered hover className="table">
          <thead>
            <tr>
              <th className="theme-code">Theme Code</th>
              <th>Theme Name</th>
              <th>Class</th>
              <th>Term</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="theme-code">{item.themeCode}</td>
                <td>{item.title}</td>
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

export default ThemeLists;
