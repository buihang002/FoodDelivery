import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.js";
import Footer from "./components/Footer/Footer.js";
import ChatBox from "./components/ChatBox/ChatBox.js";
import Home from "./pages/Home/Home.js";
import Cart from "./pages/Cart/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder.js";
import Verify from "./pages/Verify/Verify.jsx";
import MyOrders from "./pages/MyOrders/MyOrders.js";
import LoginPopup from "./components/LoginPopup/LoginPopup.js";
import LoginPage from "./pages/Login/Login.js";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  // Ẩn Navbar nếu đang ở trang login
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div>
        <div className="app">
          {" "}
          {!hideNavbar && <Navbar setShowLogin={setShowLogin} />}
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
      <Footer />
      <ChatBox />
    </>
  );
}

export default App;
