import { useEffect, useState } from "react";
import { FaPlus, FaListUl, FaHome, FaTrash, FaEdit } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, Modal, Form, Card } from "react-bootstrap";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js`;

const Chapters = () => {
  const [articles, setArticles] = useState([]);
  const [articleTitle, setArticleTitle] = useState("");
  const [article, setArticle] = useState(null);
  const [subthemeName, setSubthemeName] = useState("");
  const [themeName, setThemeName] = useState("");
  const [subthemes, setSubthemes] = useState([]);
  const { sub_theme_id } = useParams();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const openAddModal = () => {
    setArticleTitle("");
    setArticle(null);
    setShowAddModal(true);
  };

  const fetchChapters = async () => {
    try {
      const response = await axios.get(
        `http://161.97.81.168:8080/viewChapters/${sub_theme_id}`
      );
      setArticles(response.data);
      console.log("Articles loaded:", response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSubThemes = async () => {
      try {
        const response = await axios.get(
          `http://161.97.81.168:8080/getSubTheme/${sub_theme_id}`
        );
        setSubthemes(response.data);
        console.log("Sub-theme data:", response.data);
        setSubthemeName(response.data.title);
      } catch (error) {
        console.error("Error fetching subthemes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubThemes();
    fetchChapters();
  }, [sub_theme_id]);

  const handleAddChapter = async (e) => {
    e.preventDefault();

    try {
      let formData = new FormData();
      formData.append("title", articleTitle);
      formData.append("sub_theme", subthemes.id);
      formData.append("article", article);
      // Make POST request to upload media
      const response = await axios.post(
        "http://161.97.81.168:8080/addChapter/",
        formData
      );
      setShowAddModal(false);
      fetchChapters();
      console.log("Media uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading media:", error);
    }
  };

  const handleDelete = (id) => {
    setIdToDelete(id);
    setShowConfirmation(true);
    console.log("Preparing to delete item with ID:", id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://161.97.81.168:8080/deleteCapter/${idToDelete}`
      );
      setShowConfirmation(false);
      console.log("Item deleted successfully:", idToDelete);
      setIdToDelete(null);
      fetchChapters();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setIdToDelete(null);
    console.log("Delete canceled");
  };

  const handleEditClick = (id) => {
    setCurrentArticleId(id);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  useEffect(() => {
    const fetchChapter = async () => {
      if (!currentArticleId) {
        // console.error("No article ID set for editing.");
        return;
      }

      console.log("Fetching chapter details for ID:", currentArticleId);

      try {
        const response = await axios.get(
          `http://161.97.81.168:8080/getChapter/${currentArticleId}`
        );
        const chapter = response.data;
        console.log("Fetched Article:", chapter);
        setArticleTitle(chapter.title || "");
        setArticle(null); // Reset article file input
      } catch (error) {
        if (error.response) {
          console.error("Error Response Data:", error.response.data);
          console.error("Error Response Status:", error.response.status);
        } else if (error.request) {
          console.error("Error Request:", error.request);
        } else {
          console.error("Error Message:", error.message);
        }
      }
    };

    fetchChapter();
  }, [currentArticleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentArticleId) {
      console.error("No article ID specified for update.");
      return;
    }

    try {
      let formData = new FormData();
      formData.append("title", articleTitle);

      // Check if a file is selected before appending
      if (article) {
        formData.append("article", article);
      }

      const res = await axios.put(
        `http://161.97.81.168:8080/updateChapter/${currentArticleId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Chapter Updated Successfully!");
      setShowEditModal(false);
      fetchChapters();
    } catch (error) {
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
      } else if (error.request) {
        console.error("Error Request:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }
    }
  };

  const handleBack = () => {
    console.log("Navigating back to sub-theme view:", subthemes.theme);
    navigate(`/dearday/viewSubTheme/${subthemes.theme}`);
  };

  const handleOpenPdf = (pdfPath) => {
    const fullPdfUrl = `http://161.97.81.168:8080${pdfPath}`;
    setPdfUrl(fullPdfUrl);
    console.log("Opening PDF at URL:", fullPdfUrl);
  };

  return (
    <div className="dashboard-container">
      <section className="content-header">
        <h5>
          Chapters for -{" "}
          {subthemeName.length > 61
            ? subthemeName.substring(0, 61) + "..."
            : subthemeName}
        </h5>

        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="/dashboard">
                <FaHome className="breadcrumb-icon" />
              </Link>
            </li>
            <li>
              <Link to="/viewThemes">{themeName}</Link>
            </li>
            <li>
              <Link to={`/dearday/viewSubTheme/${subthemes.theme}`}>
                {subthemeName.substring(0, 10)}
              </Link>
            </li>
            <li className="active">Chapters</li>
          </ol>
        </nav>
      </section>
      <hr style={{ width: "100%", color: "#337ab7" }} />
      <div className="head">
        <Link to={`/dearday/viewSubTheme/${subthemes.theme}`}>
          <FaListUl className="icon" /> View Sub-Themes
        </Link>{" "}
        |
        <Link onClick={openAddModal}>
          <FaPlus className="icon" /> Add Chapter
        </Link>
      </div>
      <div className="table-container">
        {loading ? (
          <p>
            <b>Loading...</b>
          </p>
        ) : (
          <>
            {articles.length === 0 ? (
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
                        <th>Chapter Title</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((activity) => (
                        <tr key={activity.id}>
                          <td>
                            <button
                              onClick={() => handleOpenPdf(activity.article)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#545353",
                                textDecoration: "none",
                                cursor: "pointer",
                                fontSize: "large",
                                padding: "5px",
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

      {/* PDF Modal */}
      {pdfUrl && (
        <Modal
          show={pdfUrl}
          onHide={() => setPdfUrl("")}
          size="xl"
          backdrop="static"
          keyboard={false}
          className="pdf-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Article Content</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ height: "80vh", overflow: "auto" }}>
            <Document
              file={pdfUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={(error) =>
                console.error("Error loading PDF:", error)
              }
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  scale={1.65} // Adjust scale for clarity
                />
              ))}
            </Document>
          </Modal.Body>
        </Modal>
      )}

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmation}
        onHide={cancelDelete}
        centered
        backdrop="static"
        className="custom-modal"
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

      {/* Modal for Adding a new chapter */}
      <Modal
        show={showAddModal}
        onHide={handleCloseAddModal}
        className="custom-modal"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Chapter</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddChapter}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Article Title</Form.Label>
              <Form.Control
                type="text"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sub-Theme</Form.Label>
              <Form.Control type="text" value={subthemes.title} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>File</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf, image/*"
                onChange={(e) => setArticle(e.target.files[0])}
              />
            </Form.Group>
          </Modal.Body>

          <Button variant="success" type="submit">
            Add Chapter
          </Button>
        </Form>
      </Modal>

      {/* Modal for Editing a chapter */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        className="custom-modal"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Article</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="articleTitle">
              <Form.Label>Article Title</Form.Label>
              <Form.Control
                type="text"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="articleFile" className="mt-3">
              <Form.Label>Upload File</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf, image/*"
                onChange={(e) => setArticle(e.target.files[0])}
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button type="submit" variant="success">
                Update
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Chapters;
