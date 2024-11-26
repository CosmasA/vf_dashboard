import React, { useState, useEffect } from "react";
import { FaCog, FaBook, FaCalendarAlt, FaSchool } from "react-icons/fa";
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchThemes();
  }, []);

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

  return (
    <div className="card-container">
      {/* Card for Total Topics */}
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
          <Link
            to="/topics-modal"
            className="text-blue-500 underline focus:outline-none hover:text-blue-700"
          >
            View Details
          </Link>
        </p>
      </div>

      {/* Card for DEAR DAY Themes */}
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
          <Link
            to="/themeslist"
            className="text-blue-500 underline focus:outline-none hover:text-blue-700"
          >
            View Details
          </Link>
        </p>
      </div>

      {/* Card for Current Term */}
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
          <Link
            to="#"
            className="text-blue-500 underline focus:outline-none hover:text-blue-700"
          >
            View Details
          </Link>
        </p>
      </div>
      <div className="card">
        <div className="card-title">
          <div className="card-cover">
            <FaSchool />
          </div>
          <h3>Schools Enrolled</h3>
        </div>
        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#526d82" }}>
          51
        </p>
        <p>
          <Link
            to="#"
            className="text-blue-500 underline focus:outline-none hover:text-blue-700"
          >
            View Details
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Card;
