import React, { useState } from "react";
import User from "../../assets/user.png";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Accounts = ({ onLogout }) => {
  const navigate = useNavigate(); // Initialize navigate
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    name: "Apuke Cosmas",
    username: "cosmas",
    department: "Applied Sciences",
    designation: "Technical Associate",
    email: "cosmasapuke@mail.com",
    photo: User,
  });

  const [notifications, setNotifications] = useState({
    activity: {
      comments: true,
      forum: true,
      follows: false,
    },
    application: {
      news: true,
      updates: false,
      blog: true,
    },
  });

  const handleToggle = (section, key) => {
    setNotifications((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [key]: !prevState[section][key],
      },
    }));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, photo: URL.createObjectURL(file) });
  };

  const handleLogout = () => {
    onLogout(); // Call the logout function passed as a prop
    console.log("Logged Out Successfully!");
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="account-settings-alt-container">
      <h4 className="account-settings-alt-title">Accounts Settings</h4>

      <div className="account-settings-alt">
        {/* Sidebar */}
        <div className="account-settings-alt-sidebar">
          <div className="profile-photo-container">
            {formData.photo ? (
              <img
                src={formData.photo}
                alt="Profile"
                className="profile-photo"
              />
            ) : (
              <div className="profile-placeholder">No Photo</div>
            )}
            {/* Add the name below the photo */}
          </div>
          <div className="profile-name">
            <p>{formData.name || "John Doe"}</p>
          </div>

          <ul className="account-settings-alt-tabs">
            <li
              className={activeTab === "general" ? "active" : ""}
              onClick={() => handleTabClick("general")}
            >
              General
            </li>
            <li
              className={activeTab === "password" ? "active" : ""}
              onClick={() => handleTabClick("password")}
            >
              Change Password
            </li>
            <li
              className={activeTab === "info" ? "active" : ""}
              onClick={() => handleTabClick("info")}
            >
              Info
            </li>
            <li
              className={activeTab === "notifications" ? "active" : ""}
              onClick={() => handleTabClick("notifications")}
            >
              Notifications
            </li>
            <li
              className="logout"
              onClick={handleLogout}
              style={{ color: "red", cursor: "pointer" }}
            >
              Logout
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className="account-settings-alt-content">
          {activeTab === "general" && (
            <div className="tab-content">
              <h5>General Settings</h5>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <select
                  name="department"
                  className="form-control"
                  value={formData.department}
                  onChange={handleInputChange}
                >
                  <option value="">Select Department</option>
                  <option value="Fundi @School">Fundi @School</option>
                  <option value="Fundi @Work">Fundi @Work</option>
                  <option value="Fundi @Home">Fundi @Home</option>
                  <option value="Production">Production</option>
                  <option value="Applied Sciences">Applied Sciences</option>
                </select>
              </div>

              <div className="form-group">
                <label>Designation</label>
                <select
                  name="designation"
                  className="form-control"
                  value={formData.designation}
                  onChange={handleInputChange}
                >
                  <option value="">Select Designation</option>
                  <option value="Teaching Associate">Teaching Associate</option>
                  <option value="Software Developer">Software Developer</option>
                  <option value="Technical Associate">
                    Technical Associate
                  </option>
                  <option value="Senior Associate">Senior Associate</option>
                </select>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <div className="tab-content">
              <h5>Change Password</h5>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" className="form-control" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" className="form-control" />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" className="form-control" />
              </div>
              <div className="form-group">
                <label>Profile Photo</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>
              <div className="account-settings-alt-footer">
                <button className="btn btn-success">Save Changes</button>
                <Button className="btn info">Cancel</Button>
              </div>
            </div>
          )}

          {activeTab === "info" && (
            <div className="tab-content">
              <h5>Personal Information</h5>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  className="form-control"
                  rows="5"
                  defaultValue="This is a brief bio."
                ></textarea>
              </div>
              <div className="form-group">
                <label>Country</label>
                <select className="form-control">
                  <option>UG</option>
                  <option>USA</option>
                  <option>Canada</option>
                  <option>UK</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="tab-content">
              <h5>Notifications</h5>
              <div className="card-body">
                <h6 className="mb-4">Activity</h6>
                <div className="form-group">
                  <label className="switcher">
                    <input
                      type="checkbox"
                      className="switcher-input"
                      checked={notifications.activity.comments}
                      onChange={() => handleToggle("activity", "comments")}
                    />
                    <span className="switcher-indicator">
                      <span className="switcher-yes"></span>
                      <span className="switcher-no"></span>
                    </span>
                    <span className="switcher-label">
                      Email me when someone comments on my article
                    </span>
                  </label>
                </div>
                <div className="form-group">
                  <label className="switcher">
                    <input
                      type="checkbox"
                      className="switcher-input"
                      checked={notifications.activity.forum}
                      onChange={() => handleToggle("activity", "forum")}
                    />
                    <span className="switcher-indicator">
                      <span className="switcher-yes"></span>
                      <span className="switcher-no"></span>
                    </span>
                    <span className="switcher-label">
                      Email me when someone answers on my forum thread
                    </span>
                  </label>
                </div>
                <div className="form-group">
                  <label className="switcher">
                    <input
                      type="checkbox"
                      className="switcher-input"
                      checked={notifications.activity.follows}
                      onChange={() => handleToggle("activity", "follows")}
                    />
                    <span className="switcher-indicator">
                      <span className="switcher-yes"></span>
                      <span className="switcher-no"></span>
                    </span>
                    <span className="switcher-label">
                      Email me when someone follows me
                    </span>
                  </label>
                </div>
              </div>
              <hr className="border-light m-0" />
              <div className="card-body">
                <h6 className="mb-4">Application</h6>
                <div className="form-group">
                  <label className="switcher">
                    <input
                      type="checkbox"
                      className="switcher-input"
                      checked={notifications.application.news}
                      onChange={() => handleToggle("application", "news")}
                    />
                    <span className="switcher-indicator">
                      <span className="switcher-yes"></span>
                      <span className="switcher-no"></span>
                    </span>
                    <span className="switcher-label">
                      News and announcements
                    </span>
                  </label>
                </div>
                <div className="form-group">
                  <label className="switcher">
                    <input
                      type="checkbox"
                      className="switcher-input"
                      checked={notifications.application.updates}
                      onChange={() => handleToggle("application", "updates")}
                    />
                    <span className="switcher-indicator">
                      <span className="switcher-yes"></span>
                      <span className="switcher-no"></span>
                    </span>
                    <span className="switcher-label">
                      Weekly product updates
                    </span>
                  </label>
                </div>
                <div className="form-group">
                  <label className="switcher">
                    <input
                      type="checkbox"
                      className="switcher-input"
                      checked={notifications.application.blog}
                      onChange={() => handleToggle("application", "blog")}
                    />
                    <span className="switcher-indicator">
                      <span className="switcher-yes"></span>
                      <span className="switcher-no"></span>
                    </span>
                    <span className="switcher-label">Weekly blog digest</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accounts;
