import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const axios = require("axios");
export const SignUp = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = {
        username: credentials.username,
        password: credentials.password,
        email: credentials.email,
      };
      const options = {
        headers: { "Content-Type": "application/json" },
      };
      const res = await axios.post(
        "http://localhost:8080/OneNote/auth/createUser",
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
          <div className=" form-group col-lg-4">
            <div className="mb-3 ">
              <label htmlFor="email" className="form-label ">
                Email
              </label>
              <input
                type="email"
                className="form-control sign-input"
                value={credentials.email}
                onChange={onChange}
                id="email"
                name="email"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-3 ">
              <label htmlFor="username" className="form-label">
                UserName
              </label>
              <input
                type="text"
                className="form-control sign-input"
                value={credentials.username}
                onChange={onChange}
                id="username"
                name="username"
                aria-describedby="usernameHelp"
                minLength={5}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control sign-input"
                value={credentials.password}
                onChange={onChange}
                name="password"
                id="password"
                minLength={5}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              SIGN UP
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
