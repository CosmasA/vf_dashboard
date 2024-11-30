import React, { useState } from "react";
import { Table, Modal, Button, Card } from "react-bootstrap"; // Import Modal and Button from React-Bootstrap
import { FaPlus, FaListUl, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const SchoolDetails = () => {
  const [schoolData] = useState([
    {
      schoolName: "Vanguard Primary School",
      region: "North",
      level: "Primary",
      username: "vanguard",
      password: " @fundibots",
      tablets: 2, // Added number of tablets
    },
    {
      schoolName: "Seeta High School",
      region: "Central",
      level: "Secondary",
      username: "seeta",
      password: " @fundibots",
      tablets: 4, // Added number of tablets
    },
    {
      schoolName: "Bukokho Secondary School",
      region: "East",
      level: "Secondary",
      username: "bukokho",
      password: " @fundibots",
      tablets: 1, // Added number of tablets
    },
    {
      schoolName: "Comboni College",
      region: "North",
      level: "Secondary",
      username: "comboni",
      password: " @fundibots",
      tablets: 2, // Added number of tablets
    },
    {
      schoolName: "Bethany High School",
      region: "Central",
      level: "Secondary",
      username: "bethany",
      password: " @fundibots",
      tablets: 2, // Added number of tablets
    },
    {
      schoolName: "Arlington Primary School",
      region: "East",
      level: "Primary",
      username: "arlington",
      password: " @fundibots",
      tablets: 1, // Added number of tablets
    },
    {
      schoolName: "Nyakashambya Primary",
      region: "West",
      level: "Primary",
      username: "nyakashambya",
      password: " @fundibots",
      tablets: 2, // Added number of tablets
    },
    {
      schoolName: "Ntungamo High School",
      region: "West",
      level: "Secondary",
      username: "ntungamo",
      password: " @fundibots",
      tablets: 2, // Added number of tablets
    },
    {
      schoolName: "Nabuyonga Primary School",
      region: "East",
      level: "Primary",
      username: "nabuyonga",
      password: " @fundibots",
      tablets: 2, // Added number of tablets
    },
    {
      schoolName: "Adyel Primary School",
      region: "North",
      level: "Primary",
      username: "adyel",
      password: " @fundibots",
      tablets: 2, // Added number of tablets
    },
    {
      schoolName: "Hill Preparatory School",
      region: "Central",
      level: "Primary",
      username: "hill",
      password: " @fundibots",
      tablets: 1, // Added number of tablets
    },
    {
      schoolName: "Rays Junior School",
      region: "Central",
      level: "Primary",
      username: "rays",
      password: " @fundibots",
      tablets: 1, // Added number of tablets
    },
    {
      schoolName: "Nabumali High School",
      region: "East",
      level: "Secondary",
      username: "nabumali",
      password: " @fundibots",
      tablets: 3, // Added number of tablets
    },
    {
      schoolName: "Kitgum Public Primary",
      region: "North",
      level: "Primary",
      username: "kitgum",
      password: " @fundibots",
      tablets: 2, // Added number of tablets
    },
    {
      schoolName: "Midland High school",
      region: "Central",
      level: "Secondary",
      username: "midland",
      password: " @fundibots",
      tablets: 2, // Added number of tablets
    },
    {
      schoolName: "Hamdan Girls",
      region: "East",
      level: "Secondary",
      username: "hamdan",
      password: " @fundibots",
      tablets: 3, // Added number of tablets
    },
  ]);

  // New state for handling modal visibility and selected school
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Sort school data by region and school name alphabetically
  const sortedSchoolData = [...schoolData].sort((a, b) => {
    if (a.region === b.region) {
      return a.schoolName.localeCompare(b.schoolName); // Sort alphabetically by school name
    }
    return a.region.localeCompare(b.region); // Sort by region
  });

  // Handle school name click to open the modal
  const handleSchoolClick = (school) => {
    setSelectedSchool(school);
    setShowModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSchool(null);
  };

  return (
    <div className="dashboard-container">
      <section className="content-header">
        <h4>School Details</h4>
        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="#">
                <FaHome className="breadcrumb-icon" />
                Home
              </Link>
            </li>
            <li className="active">Schools</li>
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
        <Link to={"/viewSchools"}>
          <FaListUl className="icon" />
          View Schools
        </Link>
        |
        <Link to={"/addSchool"}>
          <FaPlus className="icon" />
          Add School
        </Link>
      </div>
      <div className="table-container">
        <Card>
          <Card.Header as="h4" className="card-header no-border">
            Schools Information
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover className="table">
              <thead>
                <tr>
                  <th>School Name</th>
                  <th>Region</th>
                  <th>Level</th>
                  <th>Username</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {sortedSchoolData.map((school, index) => (
                  <tr key={index}>
                    <td>
                      <Button
                        style={{
                          background: "none",
                          border: "none",
                          color: "inherit",
                        }}
                        onClick={() => handleSchoolClick(school)}
                      >
                        {school.schoolName}
                      </Button>
                    </td>
                    <td>{school.region}</td>
                    <td>{school.level}</td>
                    <td>{school.username}</td>
                    <td>{school.password}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>

      {/* Modal for displaying school details */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedSchool?.schoolName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Region:</strong> {selectedSchool?.region}
          </p>
          <p>
            <strong>Username:</strong> {selectedSchool?.username}
          </p>
          <p>
            <strong>Password:</strong> {selectedSchool?.password}
          </p>
          <p>
            <strong>Number of Tablets:</strong> {selectedSchool?.tablets}
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SchoolDetails;
