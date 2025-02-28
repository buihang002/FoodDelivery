import React from "react";
import { Col, Nav, Row } from "react-bootstrap";
const Navbar = () => {
  return (
    <div className="">
      <Nav>
        <Row>
          <Col>meo meo</Col>
          <Col md={3}>
            <div className="fw-bold  m-5">NGON</div>
          </Col>
          <Col md={3}>
            <div className="fw-bold  m-5">About</div>
          </Col>
          <Col md={3}>
            <div className="fw-bold  m-5">Delivery</div>
          </Col>
          <Col md={3}>
            <div className="fw-bold  m-5">Food</div>
          </Col>
        </Row>
      </Nav>
    </div>
  );
};

export default Navbar;
