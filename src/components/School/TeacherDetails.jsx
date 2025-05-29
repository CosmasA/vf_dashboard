import { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Card } from "react-bootstrap";
import { FaPlus, FaListUl, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const token = "virtual_app_token";

const TeacherDetails = () => {
  const [schoolName, setSchoolName] = useState("");
  const [teachersName, setTeachersName] = useState("");
  const [classTaught, setClassTaught] = useState("");
  const [phoneName, setPhoneName] = useState("");
  const [teachersData, setTeachersData] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editTeacherId, setEditTeacherId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    teacherName: "",
    schoolName: "",
    contactNumber: "",
    classTaught: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const token = getToken(); // Retrieve the token
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
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const token = getToken(); // Retrieve the token
      const response = await axios.post(
        "https://fbappliedscience.com/api/addTeacher/",
        {
          schoolName: schoolName,
          teachersName: teachersName,
          classTaught: classTaught,
          phoneName: phoneName,
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
    } catch (error) {
      console.error("Error inserting data:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  const fetchTeacherById = async (teacherId) => {
    try {
      const response = await axios.get(
        `https://fbappliedscience.com/api/getTeacher/${teacherId}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const details = response.data;
      setClassTaught(details.classTaught);
      setTeachersName(details.teachersName);
      setSchoolName(details.schoolName);
      setPhoneName(details.phoneName);
      setEditTeacherId(details.id);
      console.log(details);
    } catch (error) {
      console.error("Error fetching a teacher by ID:", error);
    }
  };
  // Function to open modal and set selected teacher details
  const handleShowModal = (teacher) => {
    setSelectedTeacher(teacher);
    setEditFormData({
      teacherName: teacher.teachersName,
      schoolName: teacher.schoolName,
      contactNumber: teacher.phoneName,
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
    // Reset fields to default values
    setSchoolName("");
    setTeachersName("");
    setClassTaught("");
    setPhoneName("");

    // Close the modal
    setShowAddModal(false);
  };

  // Function to handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Function to save changes
  const handleSaveChanges = () => {
    if (!editTeacherId) {
      console.error("Teacher ID is undefined");
      return;
    }
    axios
      .put(
        `https://fbappliedscience.com/api/updateTeacher/${editTeacherId}`,
        {
          schoolName: schoolName,
          teachersName: teachersName,
          classTaught: classTaught,
          phoneName: phoneName,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setSuccess("Teacher details updated successfully.");
        alert("Teacher details updated successfully");
        console.log("Response:", response);
        setError(null);
        handleCloseModal();
      })
      .catch((err) => {
        setError("Failed to update teacher details.", err);
        setSuccess(null);
      });
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
          {selectedTeacher && !isEditing && (
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
              <Button variant="warning" onClick={fetchTeacherById}>
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
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Teacher Name</Form.Label>
              <Form.Control
                type="text"
                name="teacherName"
                value={teachersName}
                onChange={(e) => setTeachersName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>School Name</Form.Label>
              <Form.Control
                type="text"
                name="schoolName"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                name="contactNumber"
                value={phoneName}
                onChange={(e) => setPhoneName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Class Taught</Form.Label>
              <Form.Select
                name="classTaught"
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
