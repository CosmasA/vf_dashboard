import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaListUl, FaHome } from "react-icons/fa";
import axios from "axios";

const token = "virtual_app_token";

const Secondary = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [topicDetails, setTopicDetails] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newTopicData, setNewTopicData] = useState({
    topicName: "",
    topicCode: "",
    classTaught: "",
    term: "",
    subject: "",
    cat: "Secondary",
  });
  const [editTopicData, setEditTopicData] = useState({
    id: null,
    topicName: "",
    topicCode: "",
    classTaught: "",
    term: "",
    subject: "",
    cat: "Secondary",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://fbappliedscience.com/api/viewSecTopics/",
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleShowTopicDetails = (topic) => {
    setTopicDetails(topic);
    setShowDetailsModal(true); // Show the modal with topic details
  };

  const handleCloseDetailsModal = () => setShowDetailsModal(false);

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowEditModal = (topic) => {
    setEditTopicData(topic);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleAddChange = (e) => {
    setNewTopicData({
      ...newTopicData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditChange = (e) => {
    setEditTopicData({
      ...editTopicData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTopic = async () => {
    if (
      !newTopicData.topicName ||
      !newTopicData.topicCode ||
      !newTopicData.classTaught ||
      !newTopicData.term ||
      !newTopicData.subject
    ) {
      alert("Please fill in all required fields.");
      return; // Prevent form submission
    }
    try {
      await axios.post(
        "https://fbappliedscience.com/api/addTopic/",
        {
          ...newTopicData,
          cat: "Primary",
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShowAddModal(false);
      setNewTopicData({
        topicName: "",
        topicCode: "",
        classTaught: "",
        term: "",
        subject: "",
        cat: "Primary",
      });
      const response = await axios.get(
        "https://fbappliedscience.com/api/viewPriTopics/",
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  };

  const handleEditTopic = async () => {
    if (
      !editTopicData.topicName ||
      !editTopicData.topicCode ||
      !editTopicData.classTaught ||
      !editTopicData.term ||
      !editTopicData.subject
    ) {
      alert("Please fill in all required fields.");
      return; // Prevent form submission
    }
    try {
      await axios.put(
        `https://fbappliedscience.com/api/updateTopic/${editTopicData.id}`,
        { ...editTopicData, cat: "Primary" },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShowEditModal(false);
      const response = await axios.get(
        "https://fbappliedscience.com/api/viewPriTopics/",
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error editing topic:", error);
    }
  };

  const handleDeleteTopic = () => setShowConfirmDelete(true);

  // Confirm delete action
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `https://fbappliedscience.com/api/deleteTopic/${topicDetails.id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShowDetailsModal(false);
      setShowConfirmDelete(false);
      setData(data.filter((topic) => topic.id !== topicDetails.id)); // Update UI
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  const handleViewSession = (topicId) => {
    navigate(`/secondary/viewSessionsSec/${topicId}`);
    console.log("List of sessions for topic:", topicId);
  };

  return (
    <div className="dashboard-container">
      <section className="content-header">
        <h4>Secondary Section</h4>
        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="#">
                <FaHome className="breadcrumb-icon" />
                Home
              </Link>
            </li>
            <li className="active">Secondary</li>
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
        <Link to={"/secondary"}>
          <FaListUl className="icon" />
          View Topics
        </Link>
        |
        <Link onClick={handleShowAddModal}>
          <FaPlus className="icon" />
          Add Topic
        </Link>
      </div>
      <div className="table-container">
        <Card>
          <Card.Body>
            <Table striped bordered hover className="table">
              <thead>
                <tr>
                  <th className="topic-code">Topic Code</th>
                  <th>Topic Name</th>
                  <th>Class</th>
                  <th>Term</th>
                  <th className="actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((topic) => (
                  <tr key={topic.id}>
                    <td>{topic.topicCode}</td>
                    <td>
                      {" "}
                      <Link
                        onClick={() => handleShowTopicDetails(topic)}
                        className="custom-link"
                      >
                        {topic.topicName}
                      </Link>
                    </td>
                    <td>{topic.classTaught}</td>
                    <td>{topic.term}</td>
                    <td className="actions">
                      <Button
                        className="btn warning"
                        onClick={() => handleShowEditModal(topic)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="btn info"
                        onClick={() => handleViewSession(topic.id)}
                      >
                        Sessions
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        {/* Modal to show Topic Details */}
        <Modal
          show={showDetailsModal}
          onHide={handleCloseDetailsModal}
          backdrop="static"
          keyboard={false}
          className="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Topic Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Topic Code:</strong> {topicDetails.topicCode}
            </p>
            <p>
              <strong>Topic Name:</strong> {topicDetails.topicName}
            </p>
            <p>
              <strong>Subject:</strong> {topicDetails.subject}
            </p>
            <p>
              <strong>Class:</strong> {topicDetails.classTaught}
            </p>
            <p>
              <strong>Term:</strong> {topicDetails.term}
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
      {/* Add Topic Modal */}
      <Modal
        show={showAddModal}
        onHide={handleCloseAddModal}
        backdrop="static"
        keyboard={false}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Topic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Topic Name</Form.Label>
              <Form.Control
                type="text"
                name="topicName"
                value={newTopicData.topicName}
                onChange={handleAddChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Topic Code</Form.Label>
              <Form.Control
                type="text"
                name="topicCode"
                value={newTopicData.topicCode}
                onChange={handleAddChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Section</Form.Label>
              <Form.Control
                type="text"
                id="cat"
                name="cat"
                value={"Secondary"}
                readOnly
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Class</Form.Label>
              <Form.Select
                name="classTaught"
                value={newTopicData.classTaught}
                onChange={handleAddChange}
                required
              >
                <option value="" disabled>
                  Select Class
                </option>
                <option value="S.1">S.1</option>
                <option value="S.2">S.2</option>
                <option value="S.3">S.3</option>
                <option value="S.4">S.4</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Subject</Form.Label>
              <Form.Select
                name="subject"
                value={newTopicData.subject}
                onChange={handleAddChange}
                required
              >
                <option value="" disabled>
                  Select Subject
                </option>
                <option value="Biology">BIOLOGY</option>
                <option value="Chemistry">CHEMISTRY</option>
                <option value="Physics">PHYSICS</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Term</Form.Label>
              <Form.Select
                name="term"
                value={newTopicData.term}
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
            <Button variant="success" onClick={handleAddTopic} className="mt-3">
              Add Topic
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Topic Modal */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        backdrop="static"
        keyboard={false}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Topic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Topic Name</Form.Label>
              <Form.Control
                type="text"
                name="topicName"
                value={editTopicData.topicName}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Topic Code</Form.Label>
              <Form.Control
                type="text"
                name="topicCode"
                value={editTopicData.topicCode}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Section</Form.Label>
              <Form.Control
                type="text"
                id="cat"
                name="cat"
                value={"Secondary"}
                readOnly
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Class</Form.Label>
              <Form.Select
                name="classTaught"
                value={editTopicData.classTaught}
                onChange={handleEditChange}
                required
              >
                <option value="" disabled>
                  Select Class
                </option>
                <option value="S.1">S.1</option>
                <option value="S.2">S.2</option>
                <option value="S.3">S.3</option>
                <option value="S.4">S.4</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Subject</Form.Label>
              <Form.Select
                name="subject"
                value={editTopicData.subject}
                onChange={handleEditChange}
                required
              >
                <option value="" disabled>
                  Select Subject
                </option>
                <option value="Biology">BIOLOGY</option>
                <option value="Chemistry">CHEMISTRY</option>
                <option value="Physics">PHYSICS</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Term</Form.Label>
              <Form.Select
                name="term"
                value={editTopicData.term}
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
              onClick={handleEditTopic}
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

export default Secondary;
