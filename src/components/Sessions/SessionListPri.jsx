import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaPlus, FaListUl, FaHome } from "react-icons/fa";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap";

const SessionListPri = () => {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const { topicId } = useParams();
  const [topicName, setTopicName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          `http://161.97.81.168:8080/viewSessions/${topicId}`
        );
        console.log(response.data); // Log the response data
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching activities
      }
    };

    const getTopicName = async () => {
      try {
        const response = await axios.get(
          `http://161.97.81.168:8080/getTopic/${topicId}`
        );
        setTopicName(response.data.topicName);
        console.log(response.data.topicName);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    getTopicName();
    fetchSessions();
  }, [topicId]);

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
        <Link to={`/addSession/${topicId}`}>
          <FaPlus className="icon" />
          Add Session
        </Link>
      </div>
      <div className="table-container">
        {loading ? ( // Check loading state
          <p>
            <b>Loading...</b>
          </p>
        ) : (
          <>
            {sessions.length === 0 ? ( // Check if activities are empty
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
    </div>
  );
};

export default SessionListPri;
