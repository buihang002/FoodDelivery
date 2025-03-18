import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";
import { assets } from "../../../assets/assets.js";
import { toast } from "react-toastify";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState([]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(
        `${url}/api/order/update-status/${orderId}`,
        {
          status: status,
        }
      );
      if (response.data.success) {
        toast.success("Order status updated successfully");
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredOrders(orders);
    } else if (filter === "paid") {
      setFilteredOrders(orders.filter((order) => order.payment));
    } else if (filter === "unpaid") {
      setFilteredOrders(orders.filter((order) => !order.payment));
    } else {
      setFilteredOrders(orders.filter((order) => order.status === filter));
    }
  }, [filter, orders]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Food processing":
        return "status-processing";
      case "Shipped":
        return "status-shipped";
      case "Delivered":
        return "status-delivered";
      default:
        return "status-processing";
    }
  };

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Orders Management</h2>
        <div className="orders-filters">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Orders
          </button>
          <button
            className={`filter-btn ${filter === "paid" ? "active" : ""}`}
            onClick={() => setFilter("paid")}
          >
            Paid
          </button>
          <button
            className={`filter-btn ${filter === "unpaid" ? "active" : ""}`}
            onClick={() => setFilter("unpaid")}
          >
            Unpaid
          </button>
          <button
            className={`filter-btn ${
              filter === "Food processing" ? "active" : ""
            }`}
            onClick={() => setFilter("Food processing")}
          >
            Processing
          </button>
          <button
            className={`filter-btn ${filter === "Shipped" ? "active" : ""}`}
            onClick={() => setFilter("Shipped")}
          >
            Shipped
          </button>
          <button
            className={`filter-btn ${filter === "Delivered" ? "active" : ""}`}
            onClick={() => setFilter("Delivered")}
          >
            Delivered
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-orders">
          <p>Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-orders">
          <p>No orders found</p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <div className="order-info">
                  <img src={assets.parcel_icon} alt="Order" />
                  <div>
                    <p className="order-id">
                      Order #{order._id.substring(order._id.length - 8)}
                    </p>
                    <p className="order-date">{formatDate(order.date)}</p>
                  </div>
                </div>
                <div className="order-status">
                  <span
                    className={`status-badge ${
                      order.payment ? "status-paid" : "status-unpaid"
                    }`}
                  >
                    {order.payment ? "Paid" : "Unpaid"}
                  </span>
                  <span
                    className={`status-badge ${getStatusClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="order-content">
                <div className="order-section">
                  <h4 className="order-section-title">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5z" />
                    </svg>
                    Order Items:
                  </h4>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div className="order-item" key={index}>
                        <div className="order-item-info">
                          <div className="order-item-image">
                            <img src={item.image.url} alt={item.name} />
                          </div>
                          <div className="order-item-details">
                            <div className="order-item-name">{item.name}</div>
                            <span className="order-item-quantity">
                              Quantity: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="order-item-price">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-section">
                  <h4 className="order-section-title">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                    </svg>
                    Delivery Address
                  </h4>
                  <div className="order-address">
                    {order.address && (
                      <>
                        <p className="address-line address-name">
                          {order.address.fullName}
                        </p>
                        <p className="address-line">{order.address.street}</p>
                        <p className="address-line">
                          {order.address.ward}, {order.address.district},{" "}
                          {order.address.city}
                        </p>
                        <p className="address-line">{order.address.contry}</p>
                        <p className="address-line">
                          Phone: {order.address.phone}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="order-total">
                  <span className="total-label">Total Amount:</span>
                  <span className="total-amount">
                    ${order.amount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="order-actions">
                <select
                  className="status-select"
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                >
                  <option value="Food processing">Food Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <button
                  className="update-btn"
                  onClick={() => updateOrderStatus(order._id, order.status)}
                >
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
