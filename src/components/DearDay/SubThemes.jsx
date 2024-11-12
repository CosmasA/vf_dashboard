import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaPlus, FaListUl, FaHome } from "react-icons/fa";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import parse from "html-react-parser";

const SubThemes = () => {
  const navigate = useNavigate();

  const [subThemes, setSubThemes] = useState([]);
  const { theme_id } = useParams();
  const [themeName, setThemeName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubThemes = async () => {
      try {
        const response = await axios.get(
          `http://161.97.81.168:8080/viewSubTheme/${theme_id}`
        );
        console.log("Subthemes: ", response.data); // Log the response data
        setSubThemes(response.data);
      } catch (error) {
        console.error("Error fetching subthemes:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching activities
      }
    };

    const getThemeName = async () => {
      try {
        const response = await axios.get(
          `http://161.97.81.168:8080/getTheme/${theme_id}`
        );
        setThemeName(response.data.title);
        console.log(response.data.title);
      } catch (error) {
        console.error("Error fetching theme:", error);
      }
    };

    getThemeName();
    fetchSubThemes();
  }, [theme_id]);

  const handleArticleList = (sub_theme_id) => {
    navigate(`/viewChapters/${sub_theme_id}`);
  };

  const handleEditsubtheme = (sub_theme_id) => {
    navigate(`/editSubTheme/${sub_theme_id}`);
  };

  return (
    <div className="dashboard-container">
      <section className="content-header">
        <h3>Sub-Themes for Theme...{themeName}</h3>
        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="/viewPriTopics">
                <FaHome className="breadcrumb-icon" />
                Home
              </Link>
            </li>
            <li>
              <Link to="/viewThemes">{themeName}</Link>
            </li>
            <li className="active">Sub-Themes</li>
          </ol>
        </nav>
      </section>
      <hr style={{ width: "100%", color: "#337ab7" }}></hr>
      <div className="head">
        <Link to="/viewThemes">
          <FaListUl className="icon" />
          View Themes
        </Link>{" "}
        |
        <Link to={`/addSubTheme/${theme_id}`}>
          <FaPlus className="icon" />
          Add Sub-Theme
        </Link>
      </div>
      <div className="table-container">
        {loading ? ( // Check loading state
          <p>
            <b>Loading...</b>
          </p>
        ) : (
          <>
            {subThemes.length === 0 ? ( // Check if activities are empty
              <div className="no-content-message">
                <p>
                  No <i>content found for this page!</i>
                </p>
                <br></br>
                <p>
                  Please click on the <b>+</b>Add button to add a subtheme...
                </p>
              </div>
            ) : (
              <Table className="table-container">
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
                      <td>
                        <Link
                          to={`/viewChapters/${subtheme.id}`}
                          className="custom-link"
                        >
                          {subtheme.title}
                        </Link>
                      </td>
                      <td>{subtheme.duration}</td>
                      <td>{parse(subtheme.learning_outcome)}</td>
                      <td className="subtheme-action-column">
                        <Button
                          className="btn warning"
                          onClick={() => handleEditsubtheme(subtheme.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          className="btn info"
                          onClick={() => handleArticleList(subtheme.id)}
                        >
                          Chapters
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

export default SubThemes;
