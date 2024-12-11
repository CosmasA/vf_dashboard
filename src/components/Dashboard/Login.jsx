import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { setToken } from "./token";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginLogo from "../../assets/fundi_logo.png";

const client = axios.create({
  baseURL: "http://161.97.81.168:8080/",
});

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await client.post("login/", {
        username,
        password,
      });
      setToken(res.data.token);
      console.log("Login successful:", res.data);
      onLogin(); // Call the onLogin prop
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log("Invalid username or password", err);
        setError("Invalid username or password");
      } else {
        setError("An error occurred. Please try again later.");
      }
      console.error("Login error:", err);
    }
  };

  const handleSignup = () => {
    navigate("#");
    console.log("Redirecting to signup page");
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="row w-100 h-100 align-items-center">
        {/* Left Section */}
        <div
          className="col-md-6 d-flex flex-column align-items-center justify-content-center text-center"
          style={{ height: "97vh", marginBottom: "auto" }}
        >
          <img src={loginLogo} alt="Logo" className="responsive-logo" />
          <hr
            style={{
              width: "100%",
              color: "#777",
              margin: "20px",
            }}
          ></hr>
          <h1 style={{ marginTop: "20px", marginBottom: "10rem" }}>
            VirtualFundi
          </h1>
        </div>

        {/* Right Section */}
        <div
          className="col-md-6 d-flex flex-column justify-content-center align-items-center"
          style={{
            background: "#ffffff",
            height: "97vh",
            marginBottom: "auto",
            borderRadius: "6px",
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h3 className="text-center mb-4">Welcome to VirtualFundi</h3>
          <br />
          <em>
            <h4 className="text-center mb-4">
              Please enter your Username and Password below...
            </h4>
          </em>
          <br />
          {error && <Alert variant="danger">{error}</Alert>}
          <Form
            onSubmit={submitLogin}
            style={{ width: "100vw", maxWidth: "400px" }}
          >
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label className="label-text">Username:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input-field"
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3 ">
              <Form.Label className="label-text-password">Password:</Form.Label>
              <div className="password-container">
                <Form.Control
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field"
                />
                <div
                  className="password-icon"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </Form.Group>

            <div className="d-grid mb-3">
              <Button
                className="custom-login-button"
                variant="primary"
                type="submit"
                size="lg"
              >
                Login
              </Button>
            </div>
          </Form>
          <div className="text-center mt-4">
            <p>Don't have an account?</p>
            <Button
              variant="outline-primary"
              onClick={handleSignup}
              style={{
                border: "1px solid",
                borderRadius: "5rem",
                width: "100%",
              }}
            >
              Sign Up Here!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
