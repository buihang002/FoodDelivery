import React from "react";
import Navbar from "./components/Navbar/Navbar.js";
import Sidebar from "./components/Sidebar/Sidebar.js";
import { Routes, Route } from "react-router-dom";
import Add from "./components/pages/Add/Add.js";
import List from "./components/pages/List/List.js";
import Orders from "./components/pages/Orders/Orders.js";
import { ToastContainer } from "react-toastify";
import "./App.css";

const App = () => {
  const url = "http://localhost:9999";

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <div className="app-content">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/add" element={<Add url={url} />} />
            <Route path="/list" element={<List url={url} />} />
            <Route path="/orders" element={<Orders url={url} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
