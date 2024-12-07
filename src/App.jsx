import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Sidebar from "./components/Dashboard/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import Primary from "./components/Topics/Primary";
import Secondary from "./components/Topics/Secondary";
import Login from "./components/Dashboard/Login"; // Import Login component
import Theme from "./components/DearDay/Theme";
import TopicsList from "./components/Topics/TopicsList";
import ThemeLists from "./components/DearDay/ThemeLists";
import SchoolDetails from "./components/School/SchoolDetails";
import TeacherDetails from "./components/School/TeacherDetails";
import SessionListPri from "./components/Sessions/SessionListPri";
import SessionListSec from "./components/Sessions/SessionListSec";
import SubThemes from "./components/DearDay/SubThemes";
import Chapters from "./components/DearDay/Chapters";
import Activitylist from "./components/Activities/Activitylist";
import ActivitylistSec from "./components/Activities/ActivitylistSec";
import Admins from "./components/Dashboard/Admins";
import Accounts from "./components/Dashboard/Accounts";
import { getToken, removeToken } from "./components/Dashboard/token"; // Import token utilities

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  // Function to handle successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    removeToken(); // Remove token from storage
    setIsAuthenticated(false); // Update authentication state
  };

  useEffect(() => {
    // Check token existence on load
    if (!getToken()) {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <Router basename="/vf_dashboard/">
      {isAuthenticated ? (
        <div className="dashboard">
          <Sidebar onLogout={handleLogout} /> {/* Pass logout function */}
          <div className="dashboard-content">
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Dashboard />} />
              <Route
                path="/accounts"
                element={<Accounts onLogout={handleLogout} />}
              />
              <Route path="/admins" element={<Admins />} />
              <Route path="/primary" element={<Primary />} />
              <Route
                path="/primary/viewSessionsPri/:topicId"
                element={<SessionListPri />}
              />
              <Route
                path="/secondary/viewSessionsSec/:topicId"
                element={<SessionListSec />}
              />
              <Route
                path="/primary/viewSessionsPri/activitylist/:sessionId"
                element={<Activitylist />}
              />
              <Route
                path="/secondary/viewSessionsSec/activitylists/:sessionId"
                element={<ActivitylistSec />}
              />
              <Route
                path="/dearday/viewSubTheme/:theme_id"
                element={<SubThemes />}
              />
              <Route
                path="/dearday/viewSubTheme/viewChapters/:sub_theme_id"
                element={<Chapters />}
              />
              <Route path="/secondary" element={<Secondary />} />
              <Route path="/topics-modal" element={<TopicsList />} />
              <Route path="/themeslist" element={<ThemeLists />} />
              <Route path="/dearday" element={<Theme />} />
              <Route path="/schools" element={<SchoolDetails />} />
              <Route path="/teachers" element={<TeacherDetails />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
