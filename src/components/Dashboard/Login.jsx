import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Card } from "react-bootstrap";
import axios from "axios";
import { setToken } from "./token";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginBgImage from "../../assets/fbimage.png";

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
    <div className="login-container">
      <Card className="col-md-4" style={{ background: "#e8f7ff" }}>
        <Card.Body>
          <h3 className="text-center mb-4">Welcome to VirtualFundi</h3>
          <em>
            <h4 className="text-center mb-4">Login Here!</h4>
          </em>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={submitLogin}>
            <Form.Group
              controlId="formUsername"
              className="mb-3 d-flex align-items-center"
            >
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

            <Form.Group
              controlId="formPassword"
              className="mb-3 d-flex align-items-center"
            >
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
            <br />

            <div className="d-grid mb-3">
              <Button variant="primary" type="submit" size="lg">
                Login
              </Button>
            </div>
          </Form>
          <div className="text-center mt-4">
            <p>Don't have an account?</p>
            <Button variant="link" onClick={handleSignup}>
              Sign Up Here!
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
