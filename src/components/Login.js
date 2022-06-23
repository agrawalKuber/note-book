import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const axios = require("axios");

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = {
        username: credentials.username,
        password: credentials.password,
      };
      const options = {
        headers: { "Content-Type": "application/json" },
      };
      const res = await axios.post(
        "http://localhost:8080/OneNote/auth/login",
        body,
        options
      );
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        alert("Invalid Credentials");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center my-5">
          <div className="col-lg-4">
            <div className="mb-3 ">
              <label htmlFor="username" className="form-label">
                UserName
              </label>
              <input
                type="text"
                className="form-control"
                value={credentials.username}
                onChange={onChange}
                id="username"
                name="username"
                aria-describedby="usernameHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control "
                value={credentials.password}
                onChange={onChange}
                name="password"
                id="password"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              LOGIN
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
