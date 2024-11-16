import React, { useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { FaPlus, FaListUl, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const TeacherDetails = () => {
  // Sample data for teachers
  const [teachersData, setTeachersData] = useState([
    {
      id: 1,
      teacherName: "Omia Faima Monday",
      schoolName: "Vanguard Primary School",
      contactNumber: "0772377194",
      classTaught: "P.4",
    },
    {
      id: 2,
      teacherName: "Omona Denis",
      schoolName: "Vanguard Primary School",
      contactNumber: "0775989397",
      classTaught: "P.4",
    },
    {
      id: 3,
      teacherName: "Boyo Muhamudu",
      schoolName: "Bukokho Secondary School",
      contactNumber: "0785718545",
      classTaught: "S.1",
    },
    {
      id: 4,
      teacherName: "Mataya Martin",
      schoolName: "Bukokho Secondary School",
      contactNumber: "0776630438",
      classTaught: "S.1",
    },
    {
      id: 5,
      teacherName: "Obalim Richard",
      schoolName: "Comboni College",
      contactNumber: "0783623879",
      classTaught: "S.1",
    },
    {
      id: 6,
      teacherName: "Olima Dickson",
      schoolName: "Comboni College",
      contactNumber: "0702291493",
      classTaught: "S.1",
    },
    {
      id: 7,
      teacherName: "Nahwera Shallon",
      schoolName: "Nyakashambya Primary School",
      contactNumber: "0778059175",
      classTaught: "P.4",
    },
    {
      id: 8,
      teacherName: "Natwijuka Alison",
      schoolName: "Nyakashambya Primary School",
      contactNumber: "078943954",
      classTaught: "P.4",
    },
    {
      id: 9,
      teacherName: "Kukundakwe Poline",
      schoolName: "Ntungamo High School",
      contactNumber: "0789549870",
      classTaught: "S.1",
    },
    {
      id: 10,
      teacherName: "Nuwaha Gilbert",
      schoolName: "Ntungamo High School",
      contactNumber: "0774907761",
      classTaught: "S.1",
    },
    {
      id: 11,
      teacherName: "Mirembe Nathan",
      schoolName: "Bethany High School",
      contactNumber: "0781558060",
      classTaught: "S.1",
    },
    {
      id: 12,
      teacherName: "Mugumya Richard",
      schoolName: "Bethany High School",
      contactNumber: "0759006929",
      classTaught: "S.1",
    },
    {
      id: 13,
      teacherName: "Magumba Latif",
      schoolName: "Rays Junior School",
      contactNumber: "0750170095",
      classTaught: "P.4",
    },
    {
      id: 14,
      teacherName: "Gidudu Hilary",
      schoolName: "Arlington Junior School",
      contactNumber: "0783648343",
      classTaught: "P.4",
    },
    {
      id: 15,
      teacherName: "Isingoma B. Moses",
      schoolName: "Arlington Junior School",
      contactNumber: "0783006950",
      classTaught: "P.4",
    },
    {
      id: 16,
      teacherName: "Wakoko Edward",
      schoolName: "Hill Preparatory School",
      contactNumber: "0755369349",
      classTaught: "P.4",
    },
    {
      id: 17,
      teacherName: "Bwire Perez",
      schoolName: "Seeta High School",
      contactNumber: "0704517209",
      classTaught: "S.1",
    },
    {
      id: 18,
      teacherName: "Mujasi Samuel",
      schoolName: "Seeta High School",
      contactNumber: "0776004567",
      classTaught: "S.1",
    },
    {
      id: 19,
      teacherName: "Bisereko Daniel",
      schoolName: "Seeta High School",
      contactNumber: "0784191572",
      classTaught: "S.1",
    },
    {
      id: 20,
      teacherName: "Kusasira Graham",
      schoolName: "Seeta High School",
      contactNumber: "0702569453",
      classTaught: "S.1",
    },
    {
      id: 21,
      teacherName: "Mugarura David",
      schoolName: "Seeta High School",
      contactNumber: "0785152249",
      classTaught: "S.1",
    },
    // Add more teacher data as needed
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    teacherName: "",
    schoolName: "",
    contactNumber: "",
    classTaught: "",
  });

  const [newTeacherData, setNewTeacherData] = useState({
    teacherName: "",
    schoolName: "",
    contactNumber: "",
    classTaught: "",
  });

  // Function to open modal and set selected teacher details
  const handleShowModal = (teacher) => {
    setSelectedTeacher(teacher);
    setEditFormData({
      teacherName: teacher.teacherName,
      schoolName: teacher.schoolName,
      contactNumber: teacher.contactNumber,
      classTaught: teacher.classTaught,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTeacher(null);
    setIsEditing(false);
  };

  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewTeacherData({
      teacherName: "",
      schoolName: "",
      contactNumber: "",
      classTaught: "",
    });
  };

  // Function to toggle edit mode
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Function to handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Function to save changes
  const handleSaveChanges = () => {
    setTeachersData((prevData) =>
      prevData.map((teacher) =>
        teacher.id === selectedTeacher.id
          ? { ...teacher, ...editFormData }
          : teacher
      )
    );
    setIsEditing(false);
    handleCloseModal();
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewTeacherData({ ...newTeacherData, [name]: value });
  };

  const handleAddTeacher = () => {
    const newTeacher = {
      id: teachersData.length + 1, // Create a unique ID
      ...newTeacherData,
    };
    setTeachersData((prevData) => [...prevData, newTeacher]);
    handleCloseAddModal();
  };

  const sortedTeachersData = [...teachersData].sort((a, b) =>
    a.schoolName.localeCompare(b.schoolName)
  );

  return (
    <div className="dashboard-container">
      <section className="content-header">
        <h2>Teachers Details</h2>
        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="#">
                <FaHome className="breadcrumb-icon" />
                Home
              </Link>
            </li>
            <li className="active">Teachers</li>
          </ol>
        </nav>
      </section>
      <hr style={{ width: "100%", color: "#777" }}></hr>
      <div className="head">
        <Link to={"/viewTeachers"}>
          <FaListUl className="icon" />
          View Teachers
        </Link>
        |
        <Link onClick={handleShowAddModal}>
          <FaPlus className="icon" />
          Add Teacher
        </Link>
      </div>

      <div className="table-container">
        <Table striped bordered hover className="table">
          <thead>
            <tr>
              <th>S/No</th>
              <th>Teacher Name</th>
              <th>School Name</th>
              <th>Contact Number</th>
              <th>Class Taught</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeachersData.map((teacher, index) => (
              <tr key={teacher.id}>
                <td>{index + 1}</td>
                <td>
                  <span
                    onClick={() => handleShowModal(teacher)}
                    style={{
                      color: "inherit",
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                  >
                    {teacher.teacherName}
                  </span>
                </td>
                <td>{teacher.schoolName}</td>
                <td>{teacher.contactNumber}</td>
                <td>{teacher.classTaught}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for displaying and editing teacher details */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Edit Teacher Details" : "Teacher Details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTeacher && !isEditing && (
            <div>
              <p>
                <strong>Teacher Name:</strong> {selectedTeacher.teacherName}
              </p>
              <p>
                <strong>School Name:</strong> {selectedTeacher.schoolName}
              </p>
              <p>
                <strong>Contact Number:</strong> {selectedTeacher.contactNumber}
              </p>
              <p>
                <strong>Class Taught:</strong> {selectedTeacher.classTaught}
              </p>
              <Button className="btn warning" onClick={handleEditClick}>
                Edit
              </Button>
            </div>
          )}

          {isEditing && (
            <Form>
              <Form.Group>
                <Form.Label>Teacher Name</Form.Label>
                <Form.Control
                  type="text"
                  name="teacherName"
                  value={editFormData.teacherName}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>School Name</Form.Label>
                <Form.Control
                  type="text"
                  name="schoolName"
                  value={editFormData.schoolName}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  name="contactNumber"
                  value={editFormData.contactNumber}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Class Taught</Form.Label>
                <Form.Control
                  type="text"
                  name="classTaught"
                  value={editFormData.classTaught}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button
                variant="success"
                onClick={handleSaveChanges}
                className="mt-3"
              >
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Add Teacher Modal */}
      <Modal
        show={showAddModal}
        onHide={handleCloseAddModal}
        backdrop="static"
        keyboard={false}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Teacher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Teacher Name</Form.Label>
              <Form.Control
                type="text"
                name="teacherName"
                value={newTeacherData.teacherName}
                onChange={handleAddChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>School Name</Form.Label>
              <Form.Control
                type="text"
                name="schoolName"
                value={newTeacherData.schoolName}
                onChange={handleAddChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                name="contactNumber"
                value={newTeacherData.contactNumber}
                onChange={handleAddChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Class Taught</Form.Label>
              <Form.Control
                type="text"
                name="classTaught"
                value={newTeacherData.classTaught}
                onChange={handleAddChange}
                required
              />
            </Form.Group>
            <Button
              variant="success"
              onClick={handleAddTeacher}
              className="mt-3"
            >
              Add Teacher
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TeacherDetails;
