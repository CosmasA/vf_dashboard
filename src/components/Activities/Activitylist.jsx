import { useEffect, useState } from "react";
import { FaPlus, FaListUl, FaHome, FaTrash, FaEdit } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, Modal } from "react-bootstrap";
import parse from "html-react-parser";

const Activitylist = () => {
  const [activities, setActivities] = useState([]);
  const [sessionName, setSessionName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [data, setData] = useState([]);
  const { sessionId, topicId } = useParams();
  const [session, setSession] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activityDetails, setActivityDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const maxLength = 10;

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        `http://161.97.81.168:8080/viewActivities/${sessionId}`
      );
      setActivities(response.data);
      console.log("activities", response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching activities
    }
  };

  useEffect(() => {
    const getSessionName = async () => {
      try {
        const response = await axios.get(
          `http://161.97.81.168:8080/getSession/${sessionId}`
        );
        setSessionName(response.data.sessionName);
        console.log("session name", response.data.sessionName);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    getSessionName();
    fetchActivities();
  }, [sessionId]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(
          `http://161.97.81.168:8080/getSession/${sessionId}`
        );
        setSession(response.data);
        console.log("Session got");
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };
    fetchSession();
  }, [sessionId]);

  const fetchActivityDetails = async (activityId) => {
    try {
      const response = await axios.get(
        `http://161.97.81.168:8080/getActivity/${activityId}`
      );
      setActivityDetails(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching activity details:", error);
    }
  };

  const topicItem = data.find((item) => item.id === session.topic);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get("http://161.97.81.168:8080/");
        const topicData = response.data;
        setData(topicData);
        setTopicName(topicData.topicName);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTopics();
  }, []);

  const handleDelete = async (id) => {
    setIdToDelete(id);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      // Perform the delete operation
      await axios.delete(
        `http://161.97.81.168:8080/deleteActivity/${idToDelete}`
      );
      // After successful deletion, hide the confirmation dialog and reload the data
      setShowConfirmation(false);
      console.log("Item Deleted Successfully!");
      setIdToDelete(null); // Reset the ID to delete
      fetchActivities(); // Re-fetch activities to update the UI
    } catch (err) {
      console.log(err);
    }
  };

  const cancelDelete = () => {
    // If user cancels, hide the confirmation dialog and reset the ID to delete
    setShowConfirmation(false);
    setIdToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setActivityDetails(null);
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleUpdateActivity = (sessionId) => {
    navigate(`/editSecActivity/${sessionId}`);
    console.log("Add session for topic with code:", sessionId);
  };

  const handleBack = () => {
    navigate(`/viewSessionsPri/${session.topic}`);
  };

  return (
    <div className="dashboard-container">
      <section className="content-header">
        <h5>
          {sessionName.length > 61
            ? sessionName.substring(0, 61) + "..."
            : sessionName}
        </h5>

        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="/dashboard">
                <FaHome className="breadcrumb-icon" />
              </Link>
            </li>
            {topicItem && (
              <li>
                <Link to="/primary">{topicItem.topicName}</Link>
              </li>
            )}
            <li>
              <Link to={`/viewSessionsPri/${session.topic}`}>
                {sessionName.substring(0, maxLength)}
              </Link>
            </li>
            <li className="active">Activities</li>
          </ol>
        </nav>
      </section>
      <hr style={{ width: "100%", color: "#337ab7" }} />
      <div className="head">
        <Link to={`/viewSecSessions/${session.topic}`}>
          <FaListUl className="icon" />
          View Sessions
        </Link>{" "}
        |
        <Link to={`/add-activitydetails/${sessionId}`}>
          <FaPlus className="icon" />
          Add Activity
        </Link>
      </div>
      <div className="table-container">
        {loading ? (
          <p>
            <b>Loading...</b>
          </p>
        ) : (
          <>
            {activities.length === 0 ? (
              <div className="no-content-message">
                <p>
                  No <i>content found for this page!</i>
                </p>
                <p>
                  Please click on the <b>+</b> Add button to add content...
                </p>
              </div>
            ) : (
              <Table striped bordered hover className="table">
                <thead>
                  <tr>
                    <th>Chapter Title</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td>
                        <button
                          onClick={() => fetchActivityDetails(activity.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#545353",
                            textDecoration: "none",
                            cursor: "pointer",
                          }}
                        >
                          {activity.title}
                        </button>
                      </td>
                      <td className="topic-code">
                        <Button
                          className="btn warning"
                          onClick={() => handleUpdateActivity(activity.id)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(activity.id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </>
        )}
        <div className="submit_container">
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
        </div>
      </div>
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

      {/* Modal for Activity Details */}
      {activityDetails && (
        <>
          {/* Text Modal */}
          {activityDetails.mediaType === "text" && (
            <Modal
              show={showModal}
              onHide={handleCloseModal}
              centered
              className="custom-modal"
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Activity Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {activityDetails ? (
                  <div>
                    <p>
                      <strong>Title:</strong> {activityDetails.title}
                    </p>
                    <p>
                      <strong>Duration:</strong>{" "}
                      {parseInt(activityDetails.time)} minutes {""}
                    </p>
                    <p>
                      <strong>Teacher Activity:</strong>{" "}
                      {parse(activityDetails.teacherActivity)}
                    </p>
                    <p>
                      <strong>Learner Activity:</strong>{" "}
                      {parse(activityDetails.studentActivity)}
                    </p>
                    <p>
                      <strong>Notes:</strong> {parse(activityDetails.notes)}
                    </p>
                  </div>
                ) : (
                  <p>Loading activity details...</p>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          )}

          {/* Video Modal */}
          {activityDetails.mediaType === "video" && (
            <Modal
              show={showModal}
              onHide={handleClose}
              centered
              className="custom-modal"
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Activity Details (Video)</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <strong>Title:</strong> {activityDetails.video_title}
                {activityDetails.video && (
                  <video
                    controls
                    className="img-fluid"
                    style={{
                      width: "100%",
                      borderRadius: "4px",
                      marginTop: "10px",
                    }}
                  >
                    <source
                      src={`http://161.97.81.168:8080${activityDetails.video}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                )}
              </Modal.Body>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default Activitylist;
