import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaPlus, FaListUl, FaHome } from "react-icons/fa";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Table, Button, Modal, Form } from "react-bootstrap";
import ReactQuill from "react-quill";

const SessionListPri = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const { topicId } = useParams();
  const [topicName, setTopicName] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal-related state
  const [showModal, setShowModal] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(topicId);
  const [fundibotsResources, setFundibotsResources] = useState("");
  const [schoolResources, setSchoolResources] = useState("");
  const [duration, setDuration] = useState("");
  const [objectives, setObjectives] = useState("");

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
    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          `http://161.97.81.168:8080/viewSessions/${topicId}`
        );
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    const getTopicName = async () => {
      try {
        const response = await axios.get(
          `http://161.97.81.168:8080/getTopic/${topicId}`
        );
        setTopicName(response.data.topicName);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    getTopicName();
    fetchSessions();
  }, [topicId]);

  const handleAddSession = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://161.97.81.168:8080/addSession`,
        {
          sessionName,
          topicId: selectedTopic,
          fundibotsResources,
          schoolResources,
          duration,
          objectives,
        }
      );
      setSessions([...sessions, response.data]); // Add new session to the list
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error("Error adding session:", error);
    }
  };

  const handleActivityLists = (sessionId) => {
    navigate(`/activity-list/${sessionId}`);
  };

  const handleEditSession = (sessionId) => {
    navigate(`/editPriSession/${sessionId}`);
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
                          to={`/activity-list/${session.id}`}
                          className="custom-link"
                        >
                          {session.sessionName}
                        </Link>
                      </td>
                      <td className="action-column">
                        <Button
                          className="btn warning"
                          onClick={() => handleEditSession(session.id)}
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
            <Form.Group className="mb-3">
              <Form.Label>Resources by Fundi Bots:</Form.Label>
              <ReactQuill
                theme="snow"
                value={fundibotsResources}
                onChange={setFundibotsResources}
                style={{ height: "150px" }} // Ensures consistent size
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
                style={{ height: "150px" }} // Ensures consistent size
                placeholder="Add resources by School"
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
                style={{ height: "150px" }} // Ensures consistent size
                placeholder="Add learning objectives"
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SessionListPri;
