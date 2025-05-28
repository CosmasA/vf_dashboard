import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaPlus, FaListUl, FaHome } from "react-icons/fa";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Table, Button, Modal, Form, Card } from "react-bootstrap";
import ReactQuill from "react-quill"; // <-- Import ReactQuill
import "react-quill/dist/quill.snow.css"; // <-- Import the ReactQuill styling
import parse from "html-react-parser";

const token = "virtual_app_token";

const SubThemes = () => {
  const navigate = useNavigate();
  const { theme_id } = useParams();

  const [subThemes, setSubThemes] = useState([]);
  const [data, setData] = useState([]);
  const [themeName, setThemeName] = useState("");
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [title, setTitle] = useState("");
  const [learning_outcome, setLearning_Outcome] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedSubTheme, setSelectedSubTheme] = useState(null);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ align: [] }],
    ],
  };

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await axios.get(
          `https://fbappliedscience.com/api/getTheme/${theme_id}`,
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
        console.error("Error fetching session:", error);
      }
    };
    fetchTheme();
  }, [theme_id]);

  useEffect(() => {
    const fetchSubThemes = async () => {
      try {
        const response = await axios.get(
          `https://fbappliedscience.com/api/viewSubTheme/${theme_id}`,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSubThemes(response.data);
      } catch (error) {
        console.error("Error fetching subthemes:", error);
      } finally {
        setLoading(false);
      }
    };

    const getThemeName = async () => {
      try {
        const response = await axios.get(
          `https://fbappliedscience.com/api/getTheme/${theme_id}`,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setThemeName(response.data.title);
      } catch (error) {
        console.error("Error fetching theme:", error);
      }
    };

    getThemeName();
    fetchSubThemes();
  }, [theme_id]);

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleCloseEditModal = () => setShowEditModal(false);

  const openAddModal = () => {
    setTitle("");
    setDuration("");
    setLearning_Outcome("");
    setShowAddModal(true);
  };

  const openEditModal = (subtheme) => {
    setSelectedSubTheme(subtheme);
    setTitle(subtheme.title);
    setDuration(subtheme.duration);
    setLearning_Outcome(subtheme.learning_outcome);
    setShowEditModal(true);
  };

  const handleAddSubTheme = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://fbappliedscience.com/api/addSubTheme/", {
        title,
        theme: theme_id,
        duration,
        learning_outcome: learning_outcome,
      });
      alert("SubTheme Added successfully");
      setShowAddModal(false);
      navigate(`/viewSubTheme/${theme_id}`);
    } catch (error) {
      console.error("Error adding subtheme:", error);
    }
  };

  const handleEditSubTheme = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://fbappliedscience.com/api/updateSubTheme/${selectedSubTheme.id}`,
        {
          title,
          theme: selectedSubTheme.theme,
          duration,
          learning_outcome: learning_outcome,
        }
      );
      alert("SubTheme Updated successfully");
      setShowEditModal(false);
      navigate(`/viewSubTheme/${theme_id}`);
    } catch (error) {
      console.error("Error updating subtheme:", error);
    }
  };

  const handleView = (sub_theme_id) => {
    navigate(`/dearday/viewSubTheme/viewChapters/${sub_theme_id}`);
  };

  return (
    <div className="dashboard-container">
      <section className="content-header">
        <h3>Sub-Themes for Theme...{themeName}</h3>
        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="/vf_dashboard/">
                <FaHome className="breadcrumb-icon" />
                Home
              </Link>
            </li>
            <li>
              <Link to="/dearday">{themeName}</Link>
            </li>
            <li className="active">Sub-Themes</li>
          </ol>
        </nav>
      </section>
      <hr style={{ width: "100%", color: "#337ab7" }}></hr>
      <div className="head">
        <Link to="/dearday">
          <FaListUl className="icon" />
          View Themes
        </Link>{" "}
        |
        <Link onClick={openAddModal}>
          <FaPlus className="icon" />
          Add Sub-Theme
        </Link>
      </div>
      <div className="table-container">
        {loading ? (
          <p>
            <b>Loading...</b>
          </p>
        ) : subThemes.length === 0 ? (
          <div className="no-content-message">
            <p>
              No <i>content found for this page!</i>
            </p>
            <p>
              Please click on the <b>+</b>Add button to add a subtheme...
            </p>
          </div>
        ) : (
          <Card>
            <Card.Body>
              <Table striped bordered hover className="table">
                <thead>
                  <tr>
                    <th>Sub-Theme Name</th>
                    <th>Number of Weeks</th>
                    <th>Learning Outcome</th>
                    <th className="actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subThemes.map((subtheme) => (
                    <tr key={subtheme.id}>
                      <td>{subtheme.title}</td>
                      <td>{subtheme.duration}</td>
                      <td>{parse(subtheme.learning_outcome)}</td>
                      <td>
                        <Button
                          className="btn warning"
                          onClick={() => openEditModal(subtheme)}
                        >
                          Edit
                        </Button>
                        <Button
                          className="btn info"
                          onClick={() => handleView(subtheme.id)}
                        >
                          Chapters
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}
      </div>
      {/* Add Sub-Theme Modal */}
      <Modal
        show={showAddModal}
        onHide={handleCloseAddModal}
        centered
        className="custom-modal"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Sub-Theme</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubTheme}>
            <Form.Group controlId="title">
              <Form.Label>Sub-Theme Title:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter sub-theme title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicSubject">
              <Form.Label>Theme Name:</Form.Label>
              <Form.Select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a Theme
                </option>
                <option key={data.id} value={data.id}>
                  {data.title}
                </option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Duration</Form.Label>
              <Form.Control
                as="select"
                id="duration"
                name="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              >
                <option value="" disabled>
                  Choose No. of Weeks
                </option>
                <option value="5">5 Weeks</option>
                <option value="6">6 Weeks</option>
                <option value="7">7 Weeks</option>
                <option value="8">8 Weeks</option>
                <option value="9">9 Weeks</option>
                <option value="10">10 Weeks</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="learning_outcome">
              <Form.Label>The Learning Outcomes:</Form.Label>
              <ReactQuill
                className="ql-editor custom-editor"
                style={{
                  height: "200px",
                  width: "100%",
                  backgroundColor: "white",
                }}
                theme="snow"
                placeholder="Enter the learning outcome here..."
                value={learning_outcome}
                onChange={(value) => setLearning_Outcome(value)}
                modules={modules}
                required
              />
            </Form.Group>

            <Button variant="success" type="submit" className="mt-3">
              Add Sub-Theme
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Sub-Theme Modal */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        centered
        className="custom-modal"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Sub-Theme</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubTheme}>
            <Form.Group controlId="title">
              <Form.Label>Sub-Theme Title:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter sub-theme title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Duration</Form.Label>
              <Form.Control
                as="select"
                id="duration"
                name="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              >
                <option value="" disabled>
                  Choose No. of Weeks
                </option>
                <option value="5">5 Weeks</option>
                <option value="6">6 Weeks</option>
                <option value="7">7 Weeks</option>
                <option value="8">8 Weeks</option>
                <option value="9">9 Weeks</option>
                <option value="10">10 Weeks</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="learning_outcome">
              <Form.Label>The Learning Outcomes:</Form.Label>
              <ReactQuill
                className="ql-editor custom-editor"
                style={{
                  height: "200px",
                  width: "100%",
                  backgroundColor: "white",
                }}
                theme="snow"
                placeholder="Enter the learning outcome here..."
                value={learning_outcome}
                onChange={(value) => setLearning_Outcome(value)}
                modules={modules}
                required
              />
            </Form.Group>

            <Button variant="success" type="submit" className="mt-3">
              Update Sub-Theme
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SubThemes;
