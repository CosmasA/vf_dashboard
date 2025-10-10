import { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Card } from "react-bootstrap";
import { FaPlus, FaListUl, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

// Get token from localStorage or your auth system
const getToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || "virtual_app_token";
};

const token = getToken();

const TeacherDetails = () => {
  const [teachersData, setTeachersData] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Add Teacher Form State
  const [addFormData, setAddFormData] = useState({
    schoolName: "",
    teachersName: "",
    classTaught: "",
    phoneName: "",
  });

  // Edit Teacher Form State
  const [editFormData, setEditFormData] = useState({
    id: null,
    teachersName: "",
    schoolName: "",
    phoneName: "",
    classTaught: "",
  });

  // Fetch all teachers
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(
        "https://fbappliedscience.com/api/viewTeachers/",
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setTeachersData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle Add Teacher Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://fbappliedscience.com/api/addTeacher/",
        {
          schoolName: addFormData.schoolName,
          teachersName: addFormData.teachersName,
          classTaught: addFormData.classTaught,
          phoneName: addFormData.phoneName,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Record Added successfully");
      console.log("Response:", response);
      handleCloseAddModal();
      fetchTeachers(); // Refresh the list
    } catch (error) {
      console.error("Error inserting data:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  // Function to open modal and display teacher details
  const handleShowModal = (teacher) => {
    setSelectedTeacher(teacher);
    setEditFormData({
      id: teacher.id,
      teachersName: teacher.teachersName,
      schoolName: teacher.schoolName,
      phoneName: teacher.phoneName,
      classTaught: teacher.classTaught,
    });
    setIsEditing(false);
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
    // Reset add form fields
    setAddFormData({
      schoolName: "",
      teachersName: "",
      classTaught: "",
      phoneName: "",
    });
    setShowAddModal(false);
  };

  // Handle change for Add form
  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddFormData({ ...addFormData, [name]: value });
  };

  // Handle change for Edit form
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Switch to edit mode
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Function to save changes
  const handleSaveChanges = async () => {
    if (!editFormData.id) {
      console.error("Teacher ID is undefined");
      alert("Error: Teacher ID is missing");
      return;
    }

    try {
      const response = await axios.put(
        `https://fbappliedscience.com/api/updateTeacher/${editFormData.id}`,
        {
          schoolName: editFormData.schoolName,
          teachersName: editFormData.teachersName,
          classTaught: editFormData.classTaught,
          phoneName: editFormData.phoneName,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("Teacher details updated successfully.");
      alert("Teacher details updated successfully");
      console.log("Response:", response);
      setError(null);
      handleCloseModal();
      fetchTeachers(); // Refresh the list
    } catch (err) {
      console.error("Failed to update teacher details:", err);
      setError("Failed to update teacher details.");
      alert("Failed to update teacher details");
      setSuccess(null);
    }
  };

  const sortedTeachersData = [...teachersData].sort((a, b) =>
    a.schoolName.localeCompare(b.schoolName)
  );

  return (
    <div className="dashboard-container">
      <section className="content-header">
        <h4>Teachers Details</h4>
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
        <Card>
          <Card.Header as="h4" className="card-header no-border">
            Teachers Information
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover className="table" responsive="sm">
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
                        {teacher.teachersName}
                      </span>
                    </td>
                    <td>{teacher.schoolName}</td>
                    <td>{teacher.phoneName}</td>
                    <td>{teacher.classTaught}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
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
          {!isEditing && selectedTeacher && (
            <div>
              <p>
                <strong>Teacher Name:</strong> {selectedTeacher.teachersName}
              </p>
              <p>
                <strong>School Name:</strong> {selectedTeacher.schoolName}
              </p>
              <p>
                <strong>Contact Number:</strong> {selectedTeacher.phoneName}
              </p>
              <p>
                <strong>Class Taught:</strong> {selectedTeacher.classTaught}
              </p>
              <Button variant="warning" onClick={handleEditClick}>
                Edit
              </Button>
            </div>
          )}

          {isEditing && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Teacher Name</Form.Label>
                <Form.Control
                  type="text"
                  name="teachersName"
                  value={editFormData.teachersName}
                  onChange={handleEditFormChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>School Name</Form.Label>
                <Form.Control
                  type="text"
                  name="schoolName"
                  value={editFormData.schoolName}
                  onChange={handleEditFormChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneName"
                  value={editFormData.phoneName}
                  onChange={handleEditFormChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Class Taught</Form.Label>
                <Form.Select
                  name="classTaught"
                  value={editFormData.classTaught}
                  onChange={handleEditFormChange}
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
                </Form.Select>
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
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Teacher Name</Form.Label>
              <Form.Control
                type="text"
                name="teachersName"
                value={addFormData.teachersName}
                onChange={handleAddFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>School Name</Form.Label>
              <Form.Control
                type="text"
                name="schoolName"
                value={addFormData.schoolName}
                onChange={handleAddFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneName"
                value={addFormData.phoneName}
                onChange={handleAddFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Class Taught</Form.Label>
              <Form.Select
                name="classTaught"
                value={addFormData.classTaught}
                onChange={handleAddFormChange}
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
              </Form.Select>
            </Form.Group>
            <Button variant="success" type="submit" className="mt-3">
              Add Teacher
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TeacherDetails;