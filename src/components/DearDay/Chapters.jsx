import { useEffect, useState } from "react";
import { FaPlus, FaListUl, FaHome, FaTrash, FaEdit } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, Modal } from "react-bootstrap";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js`;

const Chapters = () => {
  const [articles, setArticles] = useState([]);
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

  const handleUpdateChapter = (sub_theme_id) => {
    console.log("Navigating to edit article with ID:", sub_theme_id);
    navigate(`/editArticle/${sub_theme_id}`);
  };

  const handleBack = () => {
    console.log("Navigating back to sub-theme view:", subthemes.theme);
    navigate(`/viewSubTheme/${subthemes.theme}`);
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
              <Link to={`/viewSubTheme/${subthemes.theme}`}>
                {subthemeName.substring(0, 10)}
              </Link>
            </li>
            <li className="active">Chapters</li>
          </ol>
        </nav>
      </section>
      <hr style={{ width: "100%", color: "#337ab7" }} />
      <div className="head">
        <Link to={`/viewSubTheme/${subthemes.theme}`}>
          <FaListUl className="icon" /> View Sub-Themes
        </Link>{" "}
        |
        <Link to={`/addArticle/${sub_theme_id}`}>
          <FaPlus className="icon" /> Add Article
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
                          onClick={() => handleUpdateChapter(activity.id)}
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
    </div>
  );
};

export default Chapters;
