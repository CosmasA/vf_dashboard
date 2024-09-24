import React, { useState, useEffect } from "react";
import { FaCog, FaBook, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const Card = () => {
  const [topic, setTopic] = useState([]);
  const [theme, setTheme] = useState([]);
  const [currentTerm, setCurrentTerm] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get("http://161.97.81.168:8080/");
        setTopic(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await axios.get(
          "http://161.97.81.168:8080/viewTheme/"
        );
        setTheme(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchThemes();
  }, []);

  useEffect(() => {
    // Get the current month (0 is January, 11 is December)
    const currentMonth = new Date().getMonth();

    // Determine the term based on the current month
    if (currentMonth >= 0 && currentMonth <= 3) {
      setCurrentTerm("I"); // Term I for months 0 (Jan) to 3 (Apr)
    } else if (currentMonth >= 4 && currentMonth <= 7) {
      setCurrentTerm("II"); // Term II for months 4 (May) to 7 (Aug)
    } else if (currentMonth >= 8 && currentMonth <= 11) {
      setCurrentTerm("III"); // Term III for months 8 (Sep) to 11 (Dec)
    }
  }, []);

  return (
    <div className="card-container">
      <div className="card">
        <div className="card-title">
          <div className="card-cover">
            <FaCog />
          </div>
          <h3>Total Topics</h3>
        </div>
        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#526d82" }}>
          {topic.length}
        </p>
        <p>
          <Link to={"/topicslist"}>View Details</Link>
        </p>
      </div>
      <div className="card">
        <div className="card-title">
          <div className="card-cover">
            <FaBook />
          </div>
          <h3>DEAR DAY Themes</h3>
        </div>
        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#526d82" }}>
          {theme.length}
        </p>
        <p>
          <Link to={"/themeslist"}>View Details</Link>
        </p>
      </div>
      <div className="card">
        <div className="card-title">
          <div className="card-cover">
            <FaCalendarAlt />
          </div>
          <h3>Current Term</h3>
        </div>
        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#526d82" }}>
          {currentTerm}
        </p>
        <p>
          <Link to={"#"}>View Details</Link>
        </p>
      </div>
    </div>
  );
};

export default Card;
