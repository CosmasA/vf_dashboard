import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Card } from "react-bootstrap";
import axios from "axios";
import loginBgImage from "../../assets/fbimage.png";
import { setToken } from "./token";

const client = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "/api" // Use the proxy in development
      : "http://161.97.81.168:8080", // Use the actual URL for production
});
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
      // Handle errors
    }
  };

  const handleSignup = () => {
    navigate("#");
    console.log("Redirecting to signup page");
  };

  return (
    <div
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        margin: "0 0 0 0",
      }}
    >
      <Card style={{ maxWidth: "600px", width: "100%", maxHeight: "600px" }}>
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
              <Form.Label className="label-text">Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
            </Form.Group>

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
