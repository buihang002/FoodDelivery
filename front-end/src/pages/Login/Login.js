import React, { useState } from "react";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import styles from "./Login.module.css";
// import { Form } from "react-router-dom";
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic đăng nhập ở đây
    console.log("Email:", email);
    console.log("Password:", password);
  };
  return (
    <div className="container mt-5">
      <Row>
        <Col
          xs={12}
          md={6}
          className="d-flex align-items-center justify-content-center "
        >
          {/* Màn hình bên trái */}
          <h1>Welcome to Tomato Shop!</h1>
        </Col>
        <Col xs={12} md={6}>
          {/* Màn hình bên phải */}
          <div className="">
            <Card className="shadow-lg w-full max-w-md p-4  ">
              <Card.Body>
                <h2 className=" font-bold text-center  mb-4">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Nhập email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="blockmb-1">Mật khẩu</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-600">
                        Ghi nhớ đăng nhập
                      </span>
                    </label>
                    {/* <a
                      href="#"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Quên mật khẩu?
                    </a> */}
                  </div>

                  <Button type="submit" className="w-full bg-blue-500 border-0">
                    Đăng Nhập
                  </Button>
                </form>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};
