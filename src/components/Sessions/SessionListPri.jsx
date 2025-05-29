import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaPlus, FaListUl, FaHome } from "react-icons/fa";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Table, Button, Modal, Form, Card } from "react-bootstrap";
import parse from "html-react-parser";
import ReactQuill from "react-quill";

const token = "virtual_app_token";

const SessionListPri = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const { topicId } = useParams();
  const [topic, setTopic] = useState([]);
  const [topicName, setTopicName] = useState("");
  const [loading, setLoading] = useState(true);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Modal-related state
  const [showModal, setShowModal] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(topicId);
  const [fundibotsResources, setFundibotsResources] = useState("");
  const [schoolResources, setSchoolResources] = useState("");
  const [duration, setDuration] = useState("");
  const [objectives, setObjectives] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSessionId, setEditSessionId] = useState(null);

  const [selectedSession, setSelectedSession] = useState(null); // To hold the clicked session details
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setSelectedSession(null);
    setShowDetailsModal(false);
  };

  // ReactQuill modules
  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
      ["clean"],
      ["link", "image", "video"],
    ],
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(
          `https://fbappliedscience.com/api/getTopic/${topicId}`,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setTopic(response.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    fetchTopics();
  }, [topicId]);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(
        `https://fbappliedscience.com/api/viewSessions/${topicId}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSessions(response.data);
      console.log("Session List:", response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getTopicName = async () => {
      try {
        const response = await axios.get(
          `https://fbappliedscience.com/api/getTopic/${topicId}`,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setTopicName(response.data.topicName);
      } catch (error) {
        console.error("Error fetching topic name:", error);
      }
    };

    getTopicName();
    fetchSessions();
  }, [topicId]);

  const handleAddSession = async (e) => {
    e.preventDefault();

    axios
      .post(
        "https://fbappliedscience.com/api/addSession/",
        {
          sessionName: sessionName,
          topic: selectedTopic,
          duration: duration,
          learningObjective: objectives,
          fundibotsResources: fundibotsResources,
          schoolResources: schoolResources,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (res) {
        console.log("Response", res);
        alert("Added successfully");
        console.log("New Session added successfully");
        setShowModal(false); // Close the modal
      });
  };

  const handleDelete = async (sessionId) => {
    setIdToDelete(sessionId);
    setShowConfirmation(true);
    console.log("Preparing to delete item with ID:", sessionId);
  };

  const confirmDelete = async () => {
    try {
      // Perform the delete operation
      await axios.delete(
        `https://fbappliedscience.com/api/deleteSession/${idToDelete}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // After successful deletion, hide the confirmation dialog and reload the data
      setShowConfirmation(false);
      setShowDetailsModal(false);
      console.log("Item Deleted Successfully!");
      setIdToDelete(null); // Reset the ID to delete
      fetchSessions(); // Re-fetch activities to update the UI
    } catch (err) {
      console.log(err);
    }
  };

  const cancelDelete = () => {
    // If user cancels, hide the confirmation dialog and reset the ID to delete
    setShowConfirmation(false);
    setIdToDelete(null);
    console.log("Delete canceled");
  };

  const fetchSessionById = async (sessionId) => {
    try {
      const response = await axios.get(
        `https://fbappliedscience.com/api/getSession/${sessionId}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const session = response.data;

      // Update the state with session data
      setSessionName(session.sessionName);
      setSelectedTopic(session.topic);
      setFundibotsResources(session.fundibotsResources);
      setSchoolResources(session.schoolResources);
      setDuration(session.duration);
      setObjectives(session.learningObjective);
      setEditSessionId(session.id);
      setShowEditModal(true);
      console.log("Data", session);
    } catch (error) {
      console.error("Error fetching session by ID:", error);
    }
  };

  const handleEditSession = async (e) => {
    e.preventDefault();
    if (!editSessionId) {
      console.error("Session ID is undefined");
      return;
    }
    try {
      await axios
        .put(
          `https://fbappliedscience.com/api/updateSession/${editSessionId}`,
          {
            sessionName: sessionName,
            topic: selectedTopic,
            duration: duration,
            learningObjective: objectives,
            fundibotsResources: fundibotsResources,
            schoolResources: schoolResources,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log("Response:", res);
          if (res.request.status === 200) {
            console.log("Session updated successfully");
            alert("Session Updated Successfully!");
          } else {
            console.log("Error");
          }
        });
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  const handleActivityLists = (sessionId) => {
    navigate(`/primary/viewSessionsPri/activitylist/${sessionId}`);
  };

  return (
    <div className="dashboard-container">
      <section className="content-header">
        <h3>Sessions for topic - {topicName}</h3>
        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="/primary">
                <FaHome className="breadcrumb-icon" />
                Home
              </Link>
            </li>
            <li>
              <Link to="/primary">{topicName}</Link>
            </li>
            <li className="active">Sessions</li>
          </ol>
        </nav>
      </section>
      <hr style={{ width: "100%", color: "#337ab7" }}></hr>
      <div className="head">
        <Link to="/primary">
          <FaListUl className="icon" />
          View Topics
        </Link>{" "}
        |
        <Link variant="primary" onClick={() => setShowModal(true)}>
          <FaPlus className="icon" />
          Add Session
        </Link>
      </div>
      <div className="table-container">
        {loading ? (
          <p>
            <b>Loading...</b>
          </p>
        ) : (
          <>
            {sessions.length === 0 ? (
              <div className="no-content-message">
                <p>
                  No <i>content found for this page!</i>
                </p>
                <br></br>
                <p>
                  Please click on the <b>+</b>Add button to add a Session...
                </p>
              </div>
            ) : (
              <Card>
                <Card.Body>
                  <Table striped bordered hover className="table">
                    <thead>
                      <tr>
                        <th>Session Name</th>
                        <th className="actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((session) => (
                        <tr key={session.id}>
                          <td>
                            <Link
                              onClick={() => handleSessionClick(session)}
                              className="custom-link"
                            >
                              {session.sessionName}
                            </Link>
                          </td>
                          <td className="action-column">
                            <Button
                              className="btn warning"
                              onClick={() => fetchSessionById(session.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              className="btn info"
                              onClick={() => handleActivityLists(session.id)}
                            >
                              Activities
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Add Session Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="custom-modal"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSession}>
            <Form.Group className="mb-3">
              <Form.Label>Session Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter session name"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicSubject">
              <Form.Label>Topic Name:</Form.Label>
              <Form.Select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a Topic
                </option>
                <option key={topic.id} value={topic.id}>
                  {topic.topicName}
                </option>
              </Form.Select>
            </Form.Group>
            <hr></hr>
            <h6>Practical Resources:</h6>
            <Form.Group className="mb-3">
              <Form.Label>Resources by Fundi Bots:</Form.Label>
              <ReactQuill
                theme="snow"
                value={fundibotsResources}
                onChange={setFundibotsResources}
                placeholder="Add resources by Fundi Bots"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Resources by School:</Form.Label>
              <ReactQuill
                theme="snow"
                value={schoolResources}
                onChange={setSchoolResources}
                placeholder="Add resources by School"
                required
              />
            </Form.Group>
            <h6>NB: Ensure that the kits contain all their components.</h6>
            <hr></hr>
            <Form.Group className="mb-3">
              <Form.Label>Duration:</Form.Label>
              <Form.Select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              >
                <option value="" disabled>
                  Choose Duration
                </option>
                <option value="40">40 mins</option>
                <option value="60">60 mins</option>
                <option value="80">80 mins</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Learning Objectives:</Form.Label>
              <ReactQuill
                theme="snow"
                value={objectives}
                onChange={setObjectives}
                placeholder="Add learning objectives"
                required
              />
            </Form.Group>
            <div className="submit">
              {/* <Button onClick={() => setShowModal(false)} variant="secondary">
                Cancel
              </Button> */}
              <Button variant="success" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Session Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        backdrop="static"
        keyboard={false}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSession}>
            <Form.Group className="mb-3">
              <Form.Label>Session Name:</Form.Label>
              <Form.Control
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Resources by Fundi Bots:</Form.Label>
              <ReactQuill
                theme="snow"
                value={fundibotsResources}
                onChange={setFundibotsResources}
                modules={modules}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Resources by School:</Form.Label>
              <ReactQuill
                theme="snow"
                value={schoolResources}
                onChange={setSchoolResources}
                modules={modules}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration:</Form.Label>
              <Form.Select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              >
                <option value="" disabled>
                  Choose Duration
                </option>
                <option value="40">40 mins</option>
                <option value="60">60 mins</option>
                <option value="80">80 mins</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Learning Objectives:</Form.Label>
              <ReactQuill
                theme="snow"
                value={objectives}
                onChange={setObjectives}
                modules={modules}
                required
              />
            </Form.Group>
            <div className="submit">
              <Button variant="success" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Session Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={closeModal}
        className="custom-modal"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Session Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSession && (
            <div>
              <p>
                <strong>Session Name:</strong>{" "}
                {parse(selectedSession.sessionName)}
              </p>
              <p>
                <strong>Tools provided by Fundi Bots:</strong>{" "}
                {parse(selectedSession.fundibotsResources)}
              </p>
              <p>
                <strong>Tools provided by the School/Learners:</strong>{" "}
                {parse(selectedSession.schoolResources)}
              </p>
              <p>
                <strong>Duration:</strong> {parse(selectedSession.duration)}{" "}
                Minutes
              </p>
              <p>
                <strong>Objectives:</strong>{" "}
                {parse(selectedSession.learningObjective)}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          {/* <Button
            variant="danger"
            onClick={() => handleDelete(selectedSession.id)}
          >
            Delete
          </Button> */}
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmation}
        onHide={cancelDelete}
        centered
        className="custom-modal"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={confirmDelete}>
            Yes
          </Button>
          <Button variant="secondary" onClick={cancelDelete}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SessionListPri;
