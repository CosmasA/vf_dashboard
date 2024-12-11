import { useRef, useEffect, useState } from "react";
import { FaPlus, FaListUl, FaHome, FaTrash, FaEdit } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios, { CancelToken } from "axios";
import { Table, Button, Modal, Form, ProgressBar, Card } from "react-bootstrap";
import parse from "html-react-parser";
import ReactQuill from "react-quill";

const ActivitylistSec = () => {
  const [activities, setActivities] = useState([]);
  const [sessionName, setSessionName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [data, setData] = useState([]);
  const { sessionId } = useParams();
  const [session, setSession] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const cancelUpload = useRef(null);
  const [uploadDone, setUploadDone] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [activityDetails, setActivityDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [activityTitle, setActivityTitle] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [teachersActivity, setTeachersActivity] = useState("");
  const [studentsActivity, setStudentsActivity] = useState("");
  const [notes, setNotes] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [realvideo, setRealvideo] = useState("");
  const [showEditActivityModal, setShowEditActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isNewVideoSelected, setIsNewVideoSelected] = useState(false);
  const [editVideo, setEditVideo] = useState(null);
  const [activityId, setActivityId] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const navigate = useNavigate();

  const maxLength = 10;

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        `http://161.97.81.168:8080/viewActivities/${sessionId}`
      );
      setActivities(response.data);
      console.log("Activities:", response.data);
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
        // console.log("session Data", response.data);
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
        // console.log("Session got:", response.data);
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
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTopics();
  }, []);

  const handleDelete = async (id) => {
    setIdToDelete(id);
    setShowConfirmation(true);
    console.log("Preparing to delete item with ID:", id);
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
    console.log("Delete canceled");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setActivityDetails(null);
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleBack = () => {
    navigate(`/secondary/viewSessionsSec/${session.topic}`);
  };

  const handleAddActivity = () => {
    setShowAddActivityModal(true); // This will open the modal
  };

  const handleAddActivitySubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("mediaType", mediaType);
    formData.append("title", activityTitle);
    formData.append("session", session.id);
    formData.append("time", selectedTime);

    if (mediaType === "video") {
      formData.append("video", video); // Append the video file
      formData.append("real_video", realvideo);
      formData.append("video_title", videoTitle);
    } else if (mediaType === "text") {
      formData.append("teacherActivity", teachersActivity);
      formData.append("studentActivity", studentsActivity);
      formData.append("notes", notes);
    }

    try {
      const response = await axios.post(
        "http://161.97.81.168:8080/addActivity/",
        formData,
        {
          onUploadProgress: (data) => {
            setPercentage(Math.round((100 * data.loaded) / data.total));
          },
          cancelToken: new axios.CancelToken(
            (cancel) => (cancelUpload.current = cancel)
          ),
        }
      );
      console.log("Activity added successfully:", response.data);
      setUploadDone(true);
      setTimeout(() => {
        setPercentage(0);
        setUploadDone(false);
      }, 2000);
      alert("New Activity Added successfully!");
      setShowAddActivityModal(false); // Close modal
      fetchActivities(); // Refresh activity list
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Upload canceled by the user.");
        alert("Upload canceled by the user!");
      } else {
        console.error("Error encountered on adding new activity:", error);
        alert("Failed to add new activity!");
      }

      setPercentage(0);
      setUploadDone(false);
    }
  };

  const handleCancelUpload = () => {
    if (cancelUpload.current) {
      cancelUpload.current("Upload canceled by the user.");
      setClicked(true);
      setPercentage(0);
      setVideo(null);
      setTimeout(() => setClicked(false), 2000); // Optional visual feedback
    }
  };

  useEffect(() => {
    if (showEditActivityModal && activityId) {
      axios
        .get(`http://161.97.81.168:8080/getActivity/${activityId}`)
        .then((response) => {
          console.log("Fetched activity data:", response.data);
          const activity = response.data;

          // Populate the states with the fetched activity data
          setEditingActivity(activity);
          setActivityTitle(activity?.title || "");
          setSelectedTime(activity?.time || "");
          setTeachersActivity(activity?.teacherActivity || "");
          setStudentsActivity(activity?.studentActivity || "");
          setNotes(activity?.notes || "");
          setVideoTitle(activity?.video_title || "");
          setEditVideo(activity?.video || null);
          setRealvideo(activity?.real_video || "");
          setMediaType(activity?.mediaType || ""); // For media type
        })
        .catch((error) => {
          console.error("Error fetching activity data:", error);
        });
    }
  }, [showEditActivityModal, activityId]);

  const handleEditClick = (id) => {
    setActivityId(id); // Set the activityId that will be edited
    setShowEditActivityModal(true); // Open the modal
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
    setIsNewVideoSelected(true);
  };

  const handleEditActivity = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("mediaType", mediaType);
    formData.append("title", activityTitle);
    formData.append("session", session.id);
    formData.append("time", selectedTime);

    if (mediaType === "video") {
      formData.append("video", video); // Append the video file
      formData.append("real_video", realvideo);
      formData.append("video_title", videoTitle);
    } else if (mediaType === "text") {
      formData.append("teacherActivity", teachersActivity);
      formData.append("studentActivity", studentsActivity);
      formData.append("notes", notes);
    }

    try {
      const response = await axios.put(
        `http://161.97.81.168:8080/updateActivity/${activityId}`,
        formData,
        {
          onUploadProgress: (data) => {
            setPercentage(Math.round((100 * data.loaded) / data.total));
          },
          cancelToken: new axios.CancelToken(
            (cancel) => (cancelUpload.current = cancel)
          ),
        }
      );
      setUploadDone(true);
      setTimeout(() => {
        setPercentage(0);
        setUploadDone(false);
      }, 2000);
      setShowEditActivityModal(false); // Close modal
      fetchActivities(); // Refresh activities list
      console.log("Activity updated successfully:", response.data);
      alert("Activity updated successfully!");
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Upload canceled by the user.");
      } else {
        console.error("Error updating activity:", error);
        alert("Failed to update activity!");
      }

      setPercentage(0);
      setUploadDone(false);
    }
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
                <Link to="/secondary">{topicItem.topicName}</Link>
              </li>
            )}
            <li>
              <Link to={`/secondary/viewSessionsSec/${session.topic}`}>
                {sessionName.substring(0, maxLength)}
              </Link>
            </li>
            <li className="active">Activities</li>
          </ol>
        </nav>
      </section>
      <hr style={{ width: "100%", color: "#337ab7" }} />
      <div className="head">
        <Link to={`/secondary/viewSessionsSec/${session.topic}`}>
          <FaListUl className="icon" />
          View Sessions
        </Link>{" "}
        |
        <Link onClick={handleAddActivity}>
          <FaPlus className="icon" />
          Add New Activity
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
              <Card>
                <Card.Body>
                  <Table striped bordered hover className="table">
                    <thead>
                      <tr>
                        <th>Activity Title</th>
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
                                color: "#526d82",
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
                              onClick={() => handleEditClick(activity.id)}
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
                </Card.Body>
              </Card>
            )}
          </>
        )}
        {/* <div className="submit_container">
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
        </div> */}
      </div>

      {/* Add Activity Modal */}
      <Modal
        show={showAddActivityModal}
        onHide={() => setShowAddActivityModal(false)}
        className="custom-modal"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Activity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="mediaType">
            <Form.Label>Media Type</Form.Label>
            <Form.Select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Media Type
              </option>
              <option value="text">Text</option>
              <option value="video">Video</option>
            </Form.Select>
          </Form.Group>

          <Form onSubmit={handleAddActivitySubmit}>
            {mediaType === "text" && (
              <>
                <Form.Group controlId="formTitle">
                  <Form.Label>Activity Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={activityTitle}
                    onChange={(e) => setActivityTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="session">
                  <Form.Label>Session</Form.Label>
                  <Form.Control
                    type="text"
                    value={session.sessionName || ""}
                    readOnly
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formDuration">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select Time
                    </option>
                    <option value="05">05 mins</option>
                    <option value="10">10 mins</option>
                    <option value="15">15 mins</option>
                    <option value="20">20 mins</option>
                    <option value="25">25 mins</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formTeacherActivity">
                  <Form.Label>Teacher's Activity</Form.Label>
                  <ReactQuill
                    theme="snow"
                    placeholder="Teacher's Activities"
                    value={teachersActivity}
                    onChange={setTeachersActivity}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formStudentActivity">
                  <Form.Label>Learners' Activity</Form.Label>
                  <ReactQuill
                    theme="snow"
                    placeholder="Learners' Activities"
                    value={studentsActivity}
                    onChange={setStudentsActivity}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formLearningOutcome">
                  <Form.Label>Notes</Form.Label>
                  <ReactQuill
                    theme="snow"
                    value={notes}
                    onChange={setNotes}
                    placeholder="Notes/Links/References"
                    required
                  />
                </Form.Group>
              </>
            )}

            {mediaType === "video" && (
              <>
                <Form.Group controlId="formTitle">
                  <Form.Label>Activity Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={activityTitle}
                    onChange={(e) => setActivityTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="session">
                  <Form.Label>Session</Form.Label>
                  <Form.Control
                    type="text"
                    value={session.sessionName || ""}
                    readOnly
                    required
                  />
                </Form.Group>

                <Form.Group controlId="selectedTime">
                  <Form.Label>Time Allocation</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select Time
                    </option>
                    <option value="05">05 mins</option>
                    <option value="10">10 mins</option>
                    <option value="15">15 mins</option>
                    <option value="20">20 mins</option>
                    <option value="25">25 mins</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="videoTitle">
                  <Form.Label>Video Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="videofile">
                  <Form.Label>Video</Form.Label>
                  <Form.Control
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideo(e.target.files[0])}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="selectedvideo">
                  <Form.Label>Select Video Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={realvideo}
                    onChange={(e) => setRealvideo(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select Video Type
                    </option>
                    <option value="realvideo">Actual Video</option>
                    <option value="placeholder">Placeholder</option>
                  </Form.Control>
                </Form.Group>
                {/* Bootstrap Progress Bar */}
                {video && (
                  <div style={{ marginTop: "10px" }}>
                    <ProgressBar
                      striped
                      animated
                      now={percentage}
                      label={`${percentage}%`}
                      style={{ height: "20px" }}
                      variant={uploadDone ? "success" : "primary"}
                    />
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      {uploadDone ? (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="tick-icon"
                          style={{ color: "green", fontSize: "1.5rem" }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faTimesCircle}
                          onClick={handleCancelUpload}
                          style={{
                            cursor: "pointer",
                            color: clicked ? "red" : "blue",
                            fontSize: "1.5rem",
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
            <br />
            <div className="submit">
              <Button variant="success" type="submit">
                Add Activity
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Activity Modal */}
      <Modal
        show={showEditActivityModal}
        onHide={() => setShowEditActivityModal(false)}
        className="custom-modal"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Activity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingActivity && (
            <Form.Group controlId="formEditMediaType">
              <Form.Label>Activity Type</Form.Label>
              <Form.Control
                as="select"
                value={editingActivity.mediaType}
                onChange={(e) =>
                  setEditingActivity({
                    ...editingActivity,
                    mediaType: e.target.value,
                  })
                }
                required
                disabled
              >
                <option value="text">Text</option>
                <option value="video">Video</option>
              </Form.Control>
            </Form.Group>
          )}

          <Form onSubmit={handleEditActivity}>
            {editingActivity?.mediaType === "video" && (
              <>
                <Form.Group controlId="formEditTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={activityTitle}
                    onChange={(e) => setActivityTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="editSelectedTime">
                  <Form.Label>Time Allocation</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select Time
                    </option>
                    <option value="05">05 mins</option>
                    <option value="10">10 mins</option>
                    <option value="15">15 mins</option>
                    <option value="20">20 mins</option>
                    <option value="25">25 mins</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="editVideoTitle">
                  <Form.Label>Video Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                {editVideo && (
                  <div className="video-container">
                    <video
                      width="100%"
                      controls
                      onError={() => console.error("Video failed to load")}
                    >
                      <source
                        src={`http://161.97.81.168:8080${editVideo}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                <Form.Group controlId="editVideofile">
                  <Form.Label>Video</Form.Label>
                  <Form.Control
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                  />
                </Form.Group>

                <Form.Group controlId="editSelectedVideo">
                  <Form.Label>Select Video Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={realvideo}
                    onChange={(e) => setRealvideo(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select Video Type
                    </option>
                    <option value="realvideo">Actual Video</option>
                    <option value="placeholder">Placeholder</option>
                  </Form.Control>
                </Form.Group>
              </>
            )}

            {editingActivity?.mediaType === "text" && (
              <>
                <Form.Group controlId="formEditTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={activityTitle}
                    onChange={(e) => setActivityTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formEditDuration">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select Time
                    </option>
                    <option value="05">05 mins</option>
                    <option value="10">10 mins</option>
                    <option value="15">15 mins</option>
                    <option value="20">20 mins</option>
                    <option value="25">25 mins</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formEditTeacherActivity">
                  <Form.Label>Teacher Activity</Form.Label>
                  <ReactQuill
                    theme="snow"
                    value={teachersActivity}
                    onChange={(value) => setTeachersActivity(value)}
                    placeholder="Teachers' Activities"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEditStudentActivity">
                  <Form.Label>Learners' Activity</Form.Label>
                  <ReactQuill
                    theme="snow"
                    value={studentsActivity}
                    onChange={(value) => setStudentsActivity(value)}
                    placeholder="Learners' Activities"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEditLearningOutcome">
                  <Form.Label>Notes</Form.Label>
                  <ReactQuill
                    theme="snow"
                    value={notes}
                    onChange={setNotes}
                    placeholder="Notes/Links/References"
                    required
                  />
                </Form.Group>
              </>
            )}

            {/* Bootstrap Progress Bar */}
            <div style={{ marginTop: "10px" }}>
              <ProgressBar
                now={percentage}
                animated
                label={`${percentage}%`}
                style={{ height: "20px" }}
                variant={uploadDone ? "success" : "primary"}
              />
              <div className="d-flex justify-content-between align-items-center mt-2">
                {uploadDone ? (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="tick-icon"
                    style={{ color: "green", fontSize: "1.5rem" }}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    onClick={handleCancelUpload}
                    style={{
                      cursor: "pointer",
                      color: clicked ? "red" : "blue",
                      fontSize: "1.5rem",
                    }}
                  />
                )}
              </div>
            </div>

            <br />
            <div className="submit">
              <Button variant="success" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
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
          <p>Are you sure you want to delete this item?</p>
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
        </>
      )}

      {activityDetails && (
        <>
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

export default ActivitylistSec;
