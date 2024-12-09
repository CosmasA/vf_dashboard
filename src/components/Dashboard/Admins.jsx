import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaListUl, FaHome } from "react-icons/fa";
import axios from "axios";
import { setToken, getToken } from "./token";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [show, setShow] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [teachersName, setTeachersName] = useState("");
  const [classTaught, setClassTaught] = useState("");
  const [phoneName, setPhoneName] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken(); // Retrieve the token
        const response = await axios.get(
          "http://161.97.81.168:8080/viewTeachers/",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Use the token here
            },
          }
        );
        setAdmins(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = getToken(); // Retrieve the token
      const response = await axios.post(
        "http://161.97.81.168:8080/addTeacher/",
        {
          schoolName,
          teachersName,
          classTaught,
          phoneName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use the token here
          },
        }
      );
      alert("Record Added successfully");
      console.log("Response:", response);
      setShow(false);
    } catch (error) {
      console.error("Error inserting data:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

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
        <Link onClick={handleShow}>
          <FaPlus className="icon" />
          Add Admin
        </Link>
      </div>
      <div className="table-container">
        {/* <Table striped bordered hover className="table">
          <thead>
            <tr>
              <th className="topic-code">ID</th>
              <th>Teacher's Name</th>
              <th>School</th>
              <th>Class</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>
                  <Link className="custom-link">{admin.teachersName}</Link>
                </td>
                <td>{admin.schoolName}</td>
                <td>{admin.classTaught}</td>
                <td>{admin.phoneName}</td>
              </tr>
            ))}
          </tbody>
        </Table> */}
      </div>
      {/* Modal Component */}
      <Modal
        show={show}
        onHide={handleClose}
        className="custom-modal"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Teacher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="teachersName">
            <Form.Label>Teacher's Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter teacher's name"
              value={teachersName}
              onChange={(e) => setTeachersName(e.target.value)}
              required
            />
          </Form.Group>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="schoolName">
              <Form.Label>School Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter school name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="classTaught">
              <Form.Label>Class Taught</Form.Label>
              <Form.Control
                as="select"
                value={classTaught}
                onChange={(e) => setClassTaught(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Class
                </option>
                <option value="P.4">P.4</option>
                <option value="P.5">P.5</option>
                <option value="P.6">P.6</option>
                <option value="P.7">P.7</option>
                <option value="S.1">S.1</option>
                <option value="S.2">S.2</option>
                <option value="S.3">S.3</option>
                <option value="S.4">S.4</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="phoneName">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={phoneName}
                onChange={(e) => setPhoneName(e.target.value)}
                required
              />
            </Form.Group>

            <div className="text-right mt-3">
              <Button variant="success" type="submit">
                Add Teacher
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Admins;
