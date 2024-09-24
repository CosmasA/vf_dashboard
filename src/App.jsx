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

const App = () => {
  return (
    <Router>
      <div className="dashboard">
        <Sidebar />

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <Routes>
            <Route index element={<Content />} />
            <Route path="/vf_dashboard" element={<Content />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/primary" element={<Primary />} />
            <Route path="/secondary" element={<Secondary />} />
            <Route path="/topicslist" element={<TopicsList />} />
            <Route path="/themeslist" element={<ThemeLists />} />
            <Route path="/dearday" element={<Theme />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
