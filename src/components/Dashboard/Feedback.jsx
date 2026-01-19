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
    const worksheet = XLSX.utils.json_to_sheet([fb]);
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

  const exportLast200ToExcel = () => {
    if (!feedbacks.length) return;

    // Take last 200 records (or fewer if less exist)
    const last200 = feedbacks.slice(-200);

    const worksheet = XLSX.utils.json_to_sheet(last200);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Last_200_Feedbacks");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "last_200_teacher_feedbacks.xlsx");
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
            <div className="mb-3 text-end">
              <Button className="btn warning" onClick={exportLast200ToExcel}>
                Export
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
                {feedbacks.map((fb) => (
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
