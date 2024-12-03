import React, { useState, useEffect } from "react";
import {
  FaCog,
  FaBook,
  FaCalendarAlt,
  FaSchool,
  FaUser,
  FaFileAlt,
} from "react-icons/fa";
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
              <Link to="/topics-modal" className="card-link">
                View Details
              </Link>
            </p>
          </div>
        </div>

        {/* Card for DEAR DAY Themes */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-title">
              <div className="card-cover">
                <FaBook />
              </div>
              <h3>DEAR Day </h3>
            </div>
            <p className="card-stat">{theme.length}</p>
            <p>
              <Link to="/themeslist" className="card-link">
                View Details
              </Link>
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
    </div>
  );
};

export default Card;
