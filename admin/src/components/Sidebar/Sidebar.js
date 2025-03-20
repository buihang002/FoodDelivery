import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets.js";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink
          to="/add"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <img src={assets.add_icon} alt="" />
          <p>Add Food Item</p>
        </NavLink>

        <NavLink
          to="/list"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <img src={assets.parcel_icon} alt="" />
          <p>Food Items List</p>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <img src={assets.order_icon} alt="" />
          <p>Manage Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
