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
  const [passwordVisible, setPasswordVisible] = useState(false);
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
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="row w-100  align-items-center login-container">
        {/* Left Section */}
        <div className="col-12 col-md-6 left-section d-flex flex-column align-items-center justify-content-center text-center">
          <img src={loginLogo} alt="Logo" className="responsive-logo mb-3" />
          <h1 className="title">VirtualFundi</h1>
        </div>

        {/* Right Section */}
        <div className="col-12 col-md-6 right-section d-flex flex-column justify-content-center align-items-center">
          <h3 className="text-center mb-4">Welcome to VirtualFundi</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form className="login-form" onSubmit={submitLogin}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password:</Form.Label>
              <div className="password-container">
                <Form.Control
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                variant="primary"
                type="submit"
                size="lg"
                style={{ border: "1px solid", borderRadius: "4rem" }}
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
                borderRadius: "4rem",
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
