// import React, { useContext, useState } from "react";
// import { StoreContext } from "../../context/StoreContext.js";
// import { GoogleLogin } from "@react-oauth/google";
// import AuthService from "../../services/auth_service.js";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Card, Button, Form, Container, Row, Col } from "react-bootstrap";
// import styles from "./Login.module.css"; // Import CSS

// const LoginPage = () => {
//   const { url, setToken } = useContext(StoreContext);
//   const [currState, setCurrState] = useState("Login");
//   const [data, setData] = useState({ name: "", email: "", password: "" });
//   const navigate = useNavigate();

//   const handleSuccess = async (credentialResponse) => {
//     try {
//       const result = await AuthService.googleAuth(
//         credentialResponse.credential
//       );
//       if (result?.role === "customer") {
//         navigate("/");
//         alert("Login Success");
//       } else {
//         alert("Không có quyền truy cập");
//       }
//     } catch (error) {
//       alert(error?.response?.data?.message || "Login Failed");
//     }
//   };

//   const handleError = () => alert("Login Failed");

//   const onChangeHandler = (event) => {
//     setData({ ...data, [event.target.name]: event.target.value });
//   };

//   const onLogin = async (event) => {
//     event.preventDefault();
//     let newUrl = `${url}/api/user/${
//       currState === "Login" ? "login" : "register"
//     }`;
//     const response = await axios.post(newUrl, data);
//     if (response.data.success) {
//       setToken(response.data.token);
//       localStorage.setItem("token", response.data.token);
//       navigate("/");
//     } else {
//       alert(response.data.message);
//     }
//   };

//   return (
//     <div className={styles.loginPage}>
//       <Container className="d-flex justify-content-center align-items-center vh-100">
//         <Row>
//           <Col>
//             <Card
//               className={`p-4 shadow-lg ${styles.loginContainer}`}
//               style={{ maxWidth: "400px", margin: "auto" }}
//             >
//               <Card.Body>
//                 <h2 className="text-center">{currState}</h2>
//                 <Form onSubmit={onLogin}>
//                   {currState === "Sign Up" && (
//                     <Form.Group className="mb-3">
//                       <Form.Control
//                         type="text"
//                         name="name"
//                         onChange={onChangeHandler}
//                         value={data.name}
//                         placeholder="Your Name"
//                         required
//                       />
//                     </Form.Group>
//                   )}
//                   <Form.Group className="mb-3">
//                     <Form.Control
//                       type="email"
//                       name="email"
//                       onChange={onChangeHandler}
//                       value={data.email}
//                       placeholder="Email"
//                       required
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Control
//                       type="password"
//                       name="password"
//                       onChange={onChangeHandler}
//                       value={data.password}
//                       placeholder="Password"
//                       required
//                     />
//                   </Form.Group>
//                   <Button type="submit" className="w-100">
//                     {currState === "Sign Up" ? "Create account" : "Login"}
//                   </Button>
//                 </Form>
//                 <div className="d-flex align-items-center justify-content-center my-3">
//                   <Form.Check type="checkbox" required className="me-2" />
//                   <small>
//                     By continuing, I agree to the terms of use and privacy
//                     policy
//                   </small>
//                 </div>
//                 <p className="text-center">
//                   {currState === "Login"
//                     ? "Create a new account? "
//                     : "Already have an account? "}
//                   <span
//                     className="text-primary"
//                     style={{ cursor: "pointer" }}
//                     onClick={() =>
//                       setCurrState(currState === "Login" ? "Sign Up" : "Login")
//                     }
//                   >
//                     Click here
//                   </span>
//                 </p>
//                 <div className="d-flex justify-content-center">
//                   <GoogleLogin
//                     onSuccess={handleSuccess}
//                     onError={handleError}
//                   />
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default LoginPage;
import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext.js";
import { GoogleLogin } from "@react-oauth/google";
import AuthService from "../../services/auth_service.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, Container, Row, Col } from "react-bootstrap";
import styles from "./Login.module.css"; // Import CSS

const LoginPage = () => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  // Xử lý đăng nhập Google thành công
  const handleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const response = await axios.post(`${url}/api/auth/google/callback`, {
        tokenId: credential,
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        alert("Login Success");
        navigate("/");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Google Login Failed");
    }
  };

  // Xử lý lỗi đăng nhập Google
  const handleError = () => alert("Google Login Failed");

  // Xử lý nhập form
  const onChangeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  // Xử lý đăng nhập hoặc đăng ký
  const onLogin = async (event) => {
    event.preventDefault();
    try {
      const newUrl = `${url}/api/user/${
        currState === "Login" ? "login" : "register"
      }`;
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(
        "Error: " + (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  return (
    <div className={styles.loginPage}>
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row>
          <Col>
            <Card
              className={`p-4 shadow-lg ${styles.loginContainer}`}
              style={{ maxWidth: "400px", margin: "auto" }}
            >
              <Card.Body>
                <h2 className="text-center">{currState}</h2>
                <Form onSubmit={onLogin}>
                  {currState === "Sign Up" && (
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="name"
                        onChange={onChangeHandler}
                        value={data.name}
                        placeholder="Your Name"
                        required
                      />
                    </Form.Group>
                  )}
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      name="email"
                      onChange={onChangeHandler}
                      value={data.email}
                      placeholder="Email"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="password"
                      name="password"
                      onChange={onChangeHandler}
                      value={data.password}
                      placeholder="Password"
                      required
                    />
                  </Form.Group>
                  <Button type="submit" className="w-100">
                    {currState === "Sign Up" ? "Create account" : "Login"}
                  </Button>
                </Form>
                <div className="d-flex align-items-center justify-content-center my-3">
                  <Form.Check type="checkbox" required className="me-2" />
                  <small>
                    By continuing, I agree to the terms of use and privacy
                    policy
                  </small>
                </div>
                <p className="text-center">
                  {currState === "Login"
                    ? "Create a new account? "
                    : "Already have an account? "}
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setCurrState(currState === "Login" ? "Sign Up" : "Login")
                    }
                  >
                    Click here
                  </span>
                </p>
                <div className="d-flex justify-content-center">
                  <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
