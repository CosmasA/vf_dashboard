import { useEffect, useState } from "react";
import { FaPlus, FaListUl, FaHome, FaTrash, FaEdit } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import parse from "html-react-parser";
import ReactQuill from "react-quill";

const Activitylist = () => {
  const [activities, setActivities] = useState([]);
  const [sessionName, setSessionName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [data, setData] = useState([]);
  const { sessionId } = useParams();
  const [session, setSession] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
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
  const [newActivity, setNewActivity] = useState({
    title: "",
    mediaType: "text", // default to text
    duration: "",
    teacherActivity: "",
    studentActivity: "",
    learningOutcome: "",
    videoUrl: "", // Only used for video activities
  });
  const [showEditActivityModal, setShowEditActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editActivityTitle, setEditActivityTitle] = useState("");
  const [editVideoTitle, setEditVideoTitle] = useState("");
  const [editSelectedTime, setEditSelectedTime] = useState("");
  const [editTeachersActivity, setEditTeachersActivity] = useState("");
  const [editStudentsActivity, setEditStudentsActivity] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editVideo, setEditVideo] = useState(null);
  const [editRealvideo, setEditRealvideo] = useState("");
  const [activityId, setActivityId] = useState(null);
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

  const handleAddActivity = () => {
    setShowAddActivityModal(true); // This will open the modal
  };

  const handleAddActivitySubmit = async (e) => {
    e.preventDefault();

    try {
      let formData = new FormData();
      formData.append("mediaType", mediaType);
      formData.append("title", activityTitle);
      formData.append("session", session.id);
      formData.append("time", selectedTime);

      if (mediaType === "text") {
        formData.append("teacherActivity", teachersActivity);
        formData.append("studentActivity", studentsActivity);
        formData.append("notes", notes);
      } else if (mediaType === "video") {
        formData.append("video", video);
        formData.append("real_video", realvideo);
        formData.append("video_title", videoTitle);
        formData.append("time", selectedTime);
        formData.append("mediaType", "video");
      }

      // Make POST request to upload media
      const response = await axios.post(
        "http://161.97.81.168:8080/addActivity/",
        formData
      );
      console.log("Activity added successfully");
      setShowAddActivityModal(false); // Close the modal after successful submission
      fetchActivities(); // Re-fetch activities to show the newly added activity
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  useEffect(() => {
    if (showEditActivityModal && activityId) {
      axios
        .get(`http://161.97.81.168:8080/getActivity/${activityId}`)
        .then((response) => {
          console.log("Fetched activity data:", response.data);
          const activity = response.data;
          setEditingActivity(activity);
          setEditActivityTitle(activity?.title || "");
          setEditSelectedTime(activity?.time || "");
          setEditTeachersActivity(activity?.teacherActivity || "");
          setEditStudentsActivity(activity?.studentActivity || "");
          setEditNotes(activity?.notes || "");
          setEditVideoTitle(activity?.video_title || "");
          setEditVideo(activity?.video || null);
          setEditRealvideo(activity?.real_video || "");
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

  const handleEditActivity = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    // Create a FormData object to handle the data (useful for file uploads)
    const formData = new FormData();
    formData.append("mediaType", editingActivity.mediaType);
    formData.append("title", editActivityTitle);
    formData.append("sessionName", session.sessionName); // Read-only field
    formData.append("timeAllocation", editSelectedTime);

    if (editingActivity.mediaType === "video") {
      formData.append("videoTitle", editVideoTitle);
      if (editVideo) {
        formData.append("video", editVideo); // Only append if a new video file is selected
      }
      formData.append("videoType", editRealvideo);
    } else if (editingActivity.mediaType === "text") {
      formData.append("teacherActivity", editTeachersActivity);
      formData.append("studentActivity", editStudentsActivity);
      formData.append("notes", editNotes);
    }

    try {
      const response = await axios.put(
        `http://161.97.81.168:8080/updateActivity/${editingActivity.id}`, // Use the activity ID
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
        }
      );

      if (response.status === 200) {
        alert("Activity updated successfully!");
        setShowEditActivityModal(false); // Close the modal
        refreshActivities(); // Optional: Refresh activity list after editing
      } else {
        alert("Failed to update activity. Please try again.");
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      alert("An error occurred while updating the activity. Please try again.");
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
        <Link to={`/viewSessionsPri/${session.topic}`}>
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
            )}
          </>
        )}
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
          <Form.Group controlId="formMediaType">
            <Form.Label>Media Type</Form.Label>
            <Form.Control
              as="select"
              value={newActivity.mediaType}
              onChange={(e) =>
                setNewActivity({ ...newActivity, mediaType: e.target.value })
              }
              required
            >
              <option value="text">Text</option>
              <option value="video">Video</option>
            </Form.Control>
          </Form.Group>

          <Form onSubmit={handleAddActivitySubmit}>
            {newActivity.mediaType === "video" && (
              <>
                <Form.Group controlId="formTitle">
                  <Form.Label>Title</Form.Label>
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
                    value={session.sessionName}
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
              </>
            )}

            {newActivity.mediaType === "text" && (
              <>
                <Form.Group controlId="formTitle">
                  <Form.Label>Title</Form.Label>
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
                    value={session.sessionName}
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
                  <Form.Label>Teacher Activity</Form.Label>
                  <ReactQuill
                    theme="snow"
                    placeholder="Teachers' Activities"
                    value={teachersActivity}
                    onChange={(value) => setTeachersActivity(value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formStudentActivity">
                  <Form.Label>Learners' Activity</Form.Label>
                  <ReactQuill
                    theme="snow"
                    placeholder="Learners' Activities"
                    value={studentsActivity}
                    onChange={(value) => setStudentsActivity(value)}
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
              <Form.Label>Media Type</Form.Label>
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
                    value={editActivityTitle || ""}
                    onChange={(e) => setEditActivityTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="editSession">
                  <Form.Label>Session</Form.Label>
                  <Form.Control
                    type="text"
                    value={session?.sessionName || ""}
                    readOnly
                    required
                  />
                </Form.Group>

                <Form.Group controlId="editSelectedTime">
                  <Form.Label>Time Allocation</Form.Label>
                  <Form.Control
                    as="select"
                    value={editSelectedTime || ""}
                    onChange={(e) => setEditSelectedTime(e.target.value)}
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
                    value={editVideoTitle || ""}
                    onChange={(e) => setEditVideoTitle(e.target.value)}
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
                    onChange={(e) => setEditVideo(e.target.files[0])}
                  />
                </Form.Group>

                <Form.Group controlId="editSelectedVideo">
                  <Form.Label>Select Video Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={editRealvideo || ""}
                    onChange={(e) => setEditRealvideo(e.target.value)}
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
                    value={editActivityTitle || ""}
                    onChange={(e) => setEditActivityTitle(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="editSession">
                  <Form.Label>Session</Form.Label>
                  <Form.Control
                    type="text"
                    value={session?.sessionName || ""}
                    readOnly
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEditDuration">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    as="select"
                    value={editSelectedTime || ""}
                    onChange={(e) => setEditSelectedTime(e.target.value)}
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
                    value={editTeachersActivity || ""}
                    onChange={(value) => setEditTeachersActivity(value)}
                    placeholder="Teachers' Activities"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEditStudentActivity">
                  <Form.Label>Learners' Activity</Form.Label>
                  <ReactQuill
                    theme="snow"
                    value={editStudentsActivity || ""}
                    onChange={(value) => setEditStudentsActivity(value)}
                    placeholder="Learners' Activities"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEditLearningOutcome">
                  <Form.Label>Notes</Form.Label>
                  <ReactQuill
                    theme="snow"
                    value={editNotes || ""}
                    onChange={setEditNotes}
                    placeholder="Notes/Links/References"
                    required
                  />
                </Form.Group>
              </>
            )}

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

export default Activitylist;
