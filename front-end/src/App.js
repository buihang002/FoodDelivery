import React from "react";
import Navbar from "./components/Navbar/Navbar.js";
import { Route, Routes } from "react-router";
import Home from "./pages/Home/Home.js";
import Cart from "./pages/Cart/Cart.js";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder.js";
import Footer from "./components/Footer/Footer.js";

function App() {
  return (
    <>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
