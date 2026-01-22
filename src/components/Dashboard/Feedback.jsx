import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaListUl, FaHome } from "react-icons/fa";
import { Table, Button, Modal, Form, Card } from "react-bootstrap";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const token = "virtual_app_token";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [exportCount, setExportCount] = useState("200");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  useEffect(() => {
    axios
      .get("https://fbappliedscience.com/api/viewFeedback", {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setFeedbacks(res.data);
        console.log("Fetched logs", res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch logs", err);
      });
  }, []);

  const parseRatings = (ratingStr) => {
    return ratingStr.split(",").map((pair, i) => {
      const [key, value] = pair.split(":");
      return (
        <li key={i}>
          {key.trim()}: {value}
        </li>
      );
    });
  };

  const normalizeFeedbackForExport = (fb) => {
    let ratings = {
      usefulness: "",
      explanation: "",
      experiments: "",
      flow: "",
      quality: "",
    };

    if (fb.videoContentRatings) {
      fb.videoContentRatings.split(",").forEach((pair) => {
        const [key, value] = pair.split(":");
        ratings[key.trim()] = value;
      });
    }

    return {
      teacherName: fb.teacherName,
      schoolName: fb.schoolName,
      classStream: fb.classStream,
      topicCovered: fb.topicCovered,
      sessionCovered: fb.sessionCovered,

      frequency: fb.frequency,
      easeOfUse: fb.easeOfUse,
      digitalContentUsefulnes: fb.digitalContentUsefulnes,
      prepTimeSaved: fb.prepTimeSaved,
      effectivenessOfIntruc: fb.effectivenessOfIntruc,

      escVideoHelpfulness: fb.escVideoHelpfulness,
      confidenceInESC: fb.confidenceInESC,
      escVideoPreparation: fb.escVideoPreparation,

      overallSatisfaction: fb.overallSatisfaction,
      challenges: fb.challenges,
      improvements: fb.improvements,
      additionalComments: fb.additionalComments,

      dateCreated: fb.dateCreated?.split("T")[0],
      evaluationDate: fb.evaluationDate?.split("T")[0],

      video_usefulness: ratings.usefulness,
      video_explanation: ratings.explanation,
      video_experiments: ratings.experiments,
      video_flow: ratings.flow,
      video_quality: ratings.quality,
    };
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = feedbacks.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(feedbacks.length / rowsPerPage);

  const exportToCSV = (fb) => {
    const headers = Object.keys(fb).join(",");
    const values = Object.values(fb)
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",");
    const csvContent = headers + "\n" + values;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `feedback_${fb.teacherName}.csv`);
  };

  const exportToExcel = (fb) => {
    const cleaned = normalizeFeedbackForExport(fb);

    const worksheet = XLSX.utils.json_to_sheet([cleaned]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `feedback_${fb.teacherName}.xlsx`);
  };

  const exportLastNToExcel = () => {
    if (!feedbacks.length || !exportCount) return;

    const n = Math.min(parseInt(exportCount, 10), feedbacks.length);
    if (isNaN(n) || n <= 0) return;

    const lastN = feedbacks.slice(-n).map(normalizeFeedbackForExport);

    const worksheet = XLSX.utils.json_to_sheet(lastN);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Last_${n}_Feedbacks`);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `last_${n}_teacher_feedbacks_cleaned.xlsx`);
  };

  return (
    <div className="dashboard-container">
      <section className="content-header">
        <h4>Feedback From Teachers</h4>
        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="#">
                <FaHome className="breadcrumb-icon" />
                Home
              </Link>
            </li>
            <li className="active">Feedbacks</li>
          </ol>
        </nav>
      </section>
      <hr
        style={{
          width: "100%",
          color: "#777",
          alignItems: "left",
          float: "left",
        }}
      ></hr>
      <div className="table-container">
        <Card>
          <Card.Body>
            <div className="mb-3 d-flex justify-content-end align-items-center gap-2">
              <Form.Control
                type="number"
                min="1"
                placeholder="Number of latest records"
                value={exportCount}
                onChange={(e) => setExportCount(e.target.value)}
                style={{ width: "220px" }}
              />
              <Button className="btn warning" onClick={exportLastNToExcel}>
                Export Last {exportCount || 0}
              </Button>
            </div>
            <Table striped bordered hover className="table">
              <thead>
                <tr>
                  <th>Teacher's Name</th>
                  <th>School Name</th>
                  <th>Class</th>
                  <th>Topic</th>
                  <th>Session Covered</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((fb) => (
                  <tr key={fb.id}>
                    <td>
                      <Link
                        className="custom-link"
                        onClick={() => {
                          setSelectedFeedback(fb);
                          setShowModal(true);
                        }}
                      >
                        {fb.teacherName}
                      </Link>
                    </td>
                    <td>{fb.schoolName}</td>
                    <td>{fb.classStream}</td>
                    <td>{fb.topicCovered}</td>
                    <td>{fb.sessionCovered}</td>
                    <td>
                      <Button
                        size="sm"
                        className="btn info"
                        onClick={() => exportToExcel(fb)}
                      >
                        Excel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-center mt-3">
              <Button
                size="sm"
                className="btn warning"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>

              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  size="sm"
                  className={`me-1 ${currentPage === i + 1 ? "btn warning" : "btn-light"}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                size="sm"
                className="btn warning"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </Card.Body>
        </Card>
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          backdrop="static"
          keyboard={false}
          className="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedFeedback && (
                <h4>
                  Feedback Details for Teacher {selectedFeedback.teacherName}
                </h4>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedFeedback && (
              <div>
                <p>
                  <strong>
                    How often do you use the Virtual Fundi Tablet?
                  </strong>{" "}
                  {selectedFeedback.frequency}
                </p>
                <p>
                  <strong>How easy is it to use the tablet for lessons?</strong>{" "}
                  {selectedFeedback.easeOfUse}
                </p>
                <p>
                  <strong>
                    How useful are the digital content and resources on the
                    tablet for preparing your lessons?
                  </strong>{" "}
                  {selectedFeedback.digitalContentUsefulnes}
                </p>
                <p>
                  <strong>
                    How much time do you save in lesson preparation by using the
                    tablet as compared to traditional methods?
                  </strong>{" "}
                  {selectedFeedback.prepTimeSaved}
                </p>
                <p>
                  <strong>
                    How effective are the instructional guides in the Virtual
                    Fundi assisting with lesson preparation?
                  </strong>{" "}
                  {selectedFeedback.effectivenessOfIntruc}
                </p>
                <hr></hr>
                <p>
                  <strong>
                    Rate the content and videos based on the following criteria:
                  </strong>
                </p>
                {selectedFeedback.videoContentRatings && (
                  <>
                    <ul>
                      {parseRatings(selectedFeedback.videoContentRatings)}
                    </ul>
                  </>
                )}
                <p>
                  <strong>
                    How helpful are the instructional videos in understanding
                    the use of ESC tools?
                  </strong>{" "}
                  {selectedFeedback.escVideoHelpfulness}
                </p>
                <p>
                  <strong>
                    How confident do you feel using the ESC learning tools after
                    watching the instructional videos?
                  </strong>{" "}
                  {selectedFeedback.confidenceInESC}
                </p>
                <p>
                  <strong>
                    Do you believe the videos adequately prepare teachers for
                    effectively integrating the tools into lessons?
                  </strong>{" "}
                  {selectedFeedback.escVideoPreparation}
                </p>
                <hr></hr>
                <p>
                  <strong>
                    How satisfied are you with the Virtual Fundi tablet?
                  </strong>{" "}
                  {selectedFeedback.overallSatisfaction}
                </p>
                <p>
                  <strong>Challenges faced while using the tablet:</strong>{" "}
                  {selectedFeedback.challenges}
                </p>
                <p>
                  <strong>Improvements for the tablet and its content:</strong>{" "}
                  {selectedFeedback.improvements}
                </p>
                <p>
                  <strong>Any additional Comments or suggestions?</strong>{" "}
                  {selectedFeedback.additionalComments}
                </p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Feedback;
