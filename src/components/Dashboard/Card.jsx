import { useState, useEffect } from "react";
import {
  FaCog,
  FaBook,
  FaCalendarAlt,
  FaSchool,
  FaUser,
  FaFileAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { Modal, Button, Table, Alert } from "react-bootstrap";
import axios from "axios";

const Card = () => {
  const [topic, setTopic] = useState([]);
  const [theme, setTheme] = useState([]);
  const [currentTerm, setCurrentTerm] = useState("");
  const [showTopicsModal, setShowTopicsModal] = useState(false); // Topics modal visibility state
  const [showThemesModal, setShowThemesModal] = useState(false); // Themes modal visibility state
  const [error, setError] = useState("");

  // Fetch topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get("http://161.97.81.168:8080/");
        setTopic(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch topics");
      }
    };
    fetchTopics();
  }, []);

  // Fetch themes
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await axios.get(
          "http://161.97.81.168:8080/viewTheme/"
        );
        setTheme(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchThemes();
  }, []);

  // Set current term based on the month
  useEffect(() => {
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 0 && currentMonth <= 3) {
      setCurrentTerm("I");
    } else if (currentMonth >= 4 && currentMonth <= 7) {
      setCurrentTerm("II");
    } else if (currentMonth >= 8 && currentMonth <= 11) {
      setCurrentTerm("III");
    }
  }, []);

  // Handle opening and closing of the Topics modal
  const handleShowTopicsModal = () => setShowTopicsModal(true);
  const handleCloseTopicsModal = () => setShowTopicsModal(false);

  // Handle opening and closing of the Themes modal
  const handleShowThemesModal = () => setShowThemesModal(true);
  const handleCloseThemesModal = () => setShowThemesModal(false);

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        {/* Card for Total Topics */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-title">
              <div className="card-cover">
                <FaCog />
              </div>
              <h3>Total Topics</h3>
            </div>
            <p className="card-stat">{topic.length}</p>
            <p>
              <Button
                variant="link"
                className="card-link"
                onClick={handleShowTopicsModal}
              >
                View Details
              </Button>
            </p>
          </div>
        </div>

        {/* Card for DEAR Day */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-title">
              <div className="card-cover">
                <FaBook />
              </div>
              <h3>DEAR Day</h3>
            </div>
            <p className="card-stat">{theme.length}</p>
            <p>
              <Button
                variant="link"
                className="card-link"
                onClick={handleShowThemesModal}
              >
                View Details
              </Button>
            </p>
          </div>
        </div>

        {/* Card for Current Term */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-title">
              <div className="card-cover">
                <FaCalendarAlt />
              </div>
              <h3>Current Term</h3>
            </div>
            <p className="card-stat">{currentTerm}</p>
            <p>
              <Link to="#" className="card-link">
                View Details
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        {/* Card for Schools Enrolled */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-title">
              <div className="card-cover">
                <FaSchool />
              </div>
              <h3>Schools Enrolled</h3>
            </div>
            <p className="card-stat">51</p>
            <p>
              <Link to="/schools" className="card-link">
                View Details
              </Link>
            </p>
          </div>
        </div>

        {/* Card for Teachers */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-title">
              <div className="card-cover">
                <FaUser />
              </div>
              <h3>Teachers</h3>
            </div>
            <p className="card-stat">21</p>
            <p>
              <Link to="/teachers" className="card-link">
                View Details
              </Link>
            </p>
          </div>
        </div>

        {/* Card for VirtualFundi Reports */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-title">
              <div className="card-cover">
                <FaFileAlt />
              </div>
              <h3>Reports</h3>
            </div>
            <p className="card-stat">02</p>
            <p>
              <Link to="#" className="card-link">
                View Details
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Modal for Topics List */}
      <Modal
        show={showTopicsModal}
        onHide={handleCloseTopicsModal}
        backdrop="static"
        keyboard={false}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Topics List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Topic Name</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Term</th>
              </tr>
            </thead>
            <tbody>
              {topic.map((item) => (
                <tr key={item.id}>
                  <td>{item.topicName}</td>
                  <td>{item.subject}</td>
                  <td>{item.classTaught}</td>
                  <td>{item.term}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      {/* Modal for Themes List */}
      <Modal
        show={showThemesModal}
        onHide={handleCloseThemesModal}
        backdrop="static"
        keyboard={false}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Themes List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th className="theme-code">Theme Code</th>
                <th>Theme Name</th>
                <th>Class</th>
                <th>Term</th>
              </tr>
            </thead>
            <tbody>
              {theme.map((item) => (
                <tr key={item.id}>
                  <td className="theme-code">{item.themeCode}</td>
                  <td>{item.title}</td>
                  <td>{item.classTaught}</td>
                  <td>{item.term}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Card;
