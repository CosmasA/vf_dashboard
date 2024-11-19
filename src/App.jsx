import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import routing components
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import Primary from "./components/Topics/Primary";
import Secondary from "./components/Topics/Secondary";
import Theme from "./components/DearDay/Theme";
import Profile from "./components/Profile";
import TopicsList from "./components/Topics/TopicsList";
import ThemeLists from "./components/DearDay/ThemeLists";
import SchoolDetails from "./components/School/SchoolDetails";
import TeacherDetails from "./components/School/TeacherDetails";
import SessionListPri from "./components/Sessions/SessionListPri";
import SessionListSec from "./components/Sessions/SessionListSec";
import SubThemes from "./components/DearDay/SubThemes";
import Chapters from "./components/DearDay/Chapters";
import Activitylist from "./components/Activities/Activitylist";

const App = () => {
  return (
    <Router basename="/vf_dashboard/">
      <div className="dashboard">
        <Sidebar />

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <Routes>
            <Route index element={<Content />} />
            <Route path="/vf_dashboard/" element={<Content />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/primary" element={<Primary />} />
            <Route
              path="/viewSessionsPri/:topicId"
              element={<SessionListPri />}
            />
            <Route
              path="/viewSessionsSec/:topicId"
              element={<SessionListSec />}
            />
            <Route path="/activitylist/:sessionId" element={<Activitylist />} />
            <Route path="/viewSubTheme/:theme_id" element={<SubThemes />} />
            <Route path="/viewChapters/:sub_theme_id" element={<Chapters />} />
            <Route path="/secondary" element={<Secondary />} />
            <Route path="/topics-modal" element={<TopicsList />} />
            <Route path="/themeslist" element={<ThemeLists />} />
            <Route path="/dearday" element={<Theme />} />
            <Route path="/schools" element={<SchoolDetails />} />
            <Route path="/teachers" element={<TeacherDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
