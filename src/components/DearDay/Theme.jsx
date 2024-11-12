import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaListUl, FaHome } from "react-icons/fa";
import axios from "axios";

const Theme = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://161.97.81.168:8080/viewTheme/"
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleUpdateActivity = (id) => {
    navigate(`/editTheme/${id}`);
    console.log("Update for theme with id: ", id);
  };

  const handleView = (theme_id) => {
    navigate(`/viewSubTheme/${theme_id}`);
  };

  return (
    <div className="dashboard-container">
      <section className="content-header">
        <h2>DEAR_Day Section</h2>
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
      <div className="head">
        <Link to={"/viewThemes"}>
          <FaListUl className="icon" />
          View Themes
        </Link>
        |
        <Link to={"/addTheme"}>
          <FaPlus className="icon" />
          Add Theme
        </Link>
      </div>
      <div className="table-container">
        <Table striped bordered hover className="table">
          <thead>
            <tr>
              <th>Theme Code</th>
              <th>Theme Name</th>
              <th>Class</th>
              <th>Term</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.themeCode}</td>
                <td>{item.title}</td>
                <td>{item.classTaught}</td>
                <td>{item.term}</td>
                <td className="action">
                  <Button className="btn warning">Edit</Button>
                  <Button
                    className="btn info"
                    onClick={() => handleView(item.id)}
                  >
                    Sub-Themes
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Theme;
