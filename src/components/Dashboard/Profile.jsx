import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { FaEdit, FaCog, FaBook, FaChalkboardTeacher } from "react-icons/fa";
import userImage from "../../assets/user.png";

const Profile = ({ onLogout }) => {
  const navigate = useNavigate(); // Initialize navigate

  const skills = [
    {
      title: "Embedded Systems Engineer",
      duration: "5+ Years",
      icon: <FaCog />,
    },
    {
      title: "Front-End Developer",
      duration: "2+ Years",
      icon: <FaChalkboardTeacher />,
    },
    {
      title: "Internship Training and Mentorships",
      duration: "2+ Years",
      icon: <FaBook />,
    },
  ];

  const handleLogoutClick = () => {
    onLogout(); // Call the logout function passed as a prop
    console.log("Logged Out Successfully!");
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h2 className="header-title">Profile</h2>
        <div className="edit">
          <FaEdit className="icon" />
        </div>
      </div>
      <div className="user-profile">
        <div className="user-detail">
          <img src={userImage} alt="User" />
          <h3 className="username">Apuke Cosmas</h3>
          <span className="profession">Technical Associate</span>
        </div>
        <div className="user-skills">
          <h3 className="skills-title">Skills</h3>
          {skills.map((skill) => (
            <div className="skill" key={skill.title}>
              <div className="skill-icon">{skill.icon}</div>
              <div className="skill-detail">
                <h5>{skill.title}</h5>
                <span>{skill.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="btn btn-danger mt-3" onClick={handleLogoutClick}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
