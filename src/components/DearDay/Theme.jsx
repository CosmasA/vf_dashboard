import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaListUl, FaHome } from "react-icons/fa";
import axios from "axios";

const Theme = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [themeDetails, setThemeDetails] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newThemeData, setNewThemeData] = useState({
    title: "",
    themeCode: "",
    term: "",
    classTaught: "",
  });
  const [editThemeData, setEditThemeData] = useState({
    id: null,
    title: "",
    themeCode: "",
    term: "",
    classTaught: "",
  });

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

  const handleShowThemeDetails = (item) => {
    setThemeDetails(item);
    setShowDetailsModal(true); // Show the modal with topic details
  };

  const handleCloseDetailsModal = () => setShowDetailsModal(false);

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowEditModal = (item) => {
    setEditThemeData(item);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleAddChange = (e) => {
    setNewThemeData({
      ...newThemeData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditChange = (e) => {
    setEditThemeData({
      ...editThemeData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTheme = async () => {
    if (
      !newThemeData.title ||
      !newThemeData.themeCode ||
      !newThemeData.classTaught ||
      !newThemeData.term
    ) {
      alert("Please fill in all required fields.");
      return; // Prevent form submission
    }
    try {
      await axios.post("http://161.97.81.168:8080/addTheme/", {
        ...newThemeData,
      });
      setShowAddModal(false);
      setNewThemeData({
        title: "",
        themeCode: "",
        term: "",
        classTaught: "",
      });
      const response = await axios.get("http://161.97.81.168:8080/viewTheme/");
      setData(response.data);
    } catch (error) {
      console.error("Error adding new theme:", error);
    }
  };

  const handleEditTheme = async () => {
    if (
      !editThemeData.title ||
      !editThemeData.themeCode ||
      !editThemeData.classTaught ||
      !editThemeData.term
    ) {
      alert("Please fill in all required fields.");
      return; // Prevent form submission
    }
    try {
      await axios.put(
        `http://161.97.81.168:8080/updateTopic/${editThemeData.id}`,
        { ...editThemeData }
      );
      setShowEditModal(false);
      const response = await axios.get("http://161.97.81.168:8080/viewTheme/");
      setData(response.data);
    } catch (error) {
      console.error("Error editing theme:", error);
    }
  };

  const handleDeleteTheme = () => setShowConfirmDelete(true);

  // Confirm delete action
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://161.97.81.168:8080/deleteTopic/${themeDetails.id}`
      );
      setShowDetailsModal(false);
      setShowConfirmDelete(false);
      setData(data.filter((item) => item.id !== themeDetails.id)); // Update UI
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  const handleView = (theme_id) => {
    navigate(`/dearday/viewSubTheme/${theme_id}`);
  };

  return (
    <div className="dashboard-container">
      <section className="content-header">
        <h4>DEAR_Day Section</h4>
        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="#">
                <FaHome className="breadcrumb-icon" />
                Home
              </Link>
            </li>
            <li className="active">DEAR_Day</li>
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
        <Link to={"/dearday"}>
          <FaListUl className="icon" />
          View Themes
        </Link>
        |
        <Link onClick={handleShowAddModal}>
          <FaPlus className="icon" />
          Add Theme
        </Link>
      </div>
      <div className="table-container">
        <Card>
          <Card.Body>
            <Table striped bordered hover className="table">
              <thead>
                <tr>
                  <th className="theme-code">Theme Code</th>
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
                    <td>
                      <Link
                        onClick={() => handleShowThemeDetails(item)}
                        className="custom-link"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td>{item.classTaught}</td>
                    <td>{item.term}</td>
                    <td className="action">
                      <Button
                        className="btn warning"
                        onClick={() => handleShowEditModal(item)}
                      >
                        Edit
                      </Button>
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
          </Card.Body>
        </Card>
        {/* Modal to show Theme Details */}
        <Modal
          show={showDetailsModal}
          onHide={handleCloseDetailsModal}
          backdrop="static"
          keyboard={false}
          className="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Theme Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Theme Code:</strong> {themeDetails.themeCode}
            </p>
            <p>
              <strong>Theme Name:</strong> {themeDetails.title}
            </p>
            <p>
              <strong>Class:</strong> {themeDetails.classTaught}
            </p>
            <p>
              <strong>Term:</strong> {themeDetails.term}
            </p>
          </Modal.Body>
          {/* <Modal.Footer>
            <Button variant="danger" onClick={handleDeleteTopic}>
              Delete
            </Button>
          </Modal.Footer> */}
        </Modal>

        {/* Confirmation Modal */}
        <Modal
          show={showConfirmDelete}
          onHide={() => setShowConfirmDelete(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={confirmDelete}>
              Yes
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmDelete(false)}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/* Add Theme Modal */}
      <Modal
        show={showAddModal}
        onHide={handleCloseAddModal}
        backdrop="static"
        keyboard={false}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Theme</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Theme Name</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newThemeData.title}
                onChange={handleAddChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Theme Code</Form.Label>
              <Form.Control
                type="text"
                name="themeCode"
                value={newThemeData.themeCode}
                onChange={handleAddChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Class</Form.Label>
              <Form.Select
                name="classTaught"
                value={newThemeData.classTaught}
                onChange={handleAddChange}
                required
              >
                <option value="" disabled>
                  Select Class
                </option>
                <option value="P.4">P.4</option>
                <option value="P.5">P.5</option>
                <option value="P.6">P.6</option>
                <option value="P.7">P.7</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Term</Form.Label>
              <Form.Select
                name="term"
                value={newThemeData.term}
                onChange={handleAddChange}
              >
                <option value="" disabled>
                  Choose Term
                </option>
                <option value="Term I">Term I</option>
                <option value="Term II">Term II</option>
                <option value="Term III">Term III</option>
              </Form.Select>
            </Form.Group>
            <Button variant="success" onClick={handleAddTheme} className="mt-3">
              Add Theme
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Theme Modal */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        backdrop="static"
        keyboard={false}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Theme</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Theme Code</Form.Label>
              <Form.Control
                type="text"
                name="topicName"
                value={editThemeData.themeCode}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Theme Name</Form.Label>
              <Form.Control
                type="text"
                name="topicCode"
                value={editThemeData.title}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Class</Form.Label>
              <Form.Select
                name="classTaught"
                value={editThemeData.classTaught}
                onChange={handleEditChange}
                required
              >
                <option value="" disabled>
                  Select Class
                </option>
                <option value="P.4">P.4</option>
                <option value="P.5">P.5</option>
                <option value="P.6">P.6</option>
                <option value="P.7">P.7</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Term</Form.Label>
              <Form.Select
                name="term"
                value={editThemeData.term}
                onChange={handleEditChange}
              >
                <option value="" disabled>
                  Choose Term
                </option>
                <option value="Term I">Term I</option>
                <option value="Term II">Term II</option>
                <option value="Term III">Term III</option>
              </Form.Select>
            </Form.Group>
            <Button
              variant="success"
              onClick={handleEditTheme}
              className="mt-3"
            >
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Theme;
