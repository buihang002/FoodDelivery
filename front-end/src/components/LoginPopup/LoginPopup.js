import React, { useContext, useEffect, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets.js";
import { StoreContext } from "../../context/StoreContext.js";
import { GoogleLogin } from "@react-oauth/google";

import AuthService from "../../services/auth_service.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSucess = async (credentialResponse) => {
    try {
      //gửi token đăng nhập cho backend để xác thực
      const result = await AuthService.googleAuth(
        credentialResponse.credential
      );
      if (result?.role === "customer") {
        //cập nhật trạng thái đăng nhập
        // dispatch(login(result));

        navigate("/");
        alert("Login Success");
      } else {
        alert("Không có quyền truy cập");
      }
    } catch (error) {
      const data = error?.response?.data;
      alert(data.message || "Login Failed");
    }
  };

  const handleError = (error) => {
    alert("Login Failed");
  };
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };
  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  const onLogin = async (even) => {
    even.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }
    const response = await axios.post(newUrl, data);
    console.log("response", response.data.success);

    if (response.data.success) {
      setToken(response.data.token);
      console.log(response.data.token);
      localStorage.setItem("token", response.data.token);
      setShowLogin(false);
    } else {
      alert(response.data.message);
    }
  };
  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? (
            <></>
          ) : (
            <input
              type="text"
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              placeholder="Your Name"
              required
            />
          )}

          <input
            type="email"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">
          {" "}
          {currState === "Sign Up" ? "Create account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuting, i agree to the terms of use and privacy policy</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account?
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
        <GoogleLogin onSuccess={handleSucess} onError={handleError} />
      </form>
    </div>
  );
};

export default LoginPopup;
