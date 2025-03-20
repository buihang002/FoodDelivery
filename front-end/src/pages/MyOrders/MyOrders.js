import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext.js";
import axios from "axios";
import { assets } from "../../assets/assets.js";
import { Modal, Button } from "react-bootstrap";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = useState();

  const fetchOrders = async () => {
    const res = await axios.post(
      url + "/api/order/userorders",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setData(res.data.data);
  };

  const trackOrder = (e) => {
    const container = e.target.closest("div .my-orders-order");
    const orderId = container.querySelector("input[name='orderId']").value;
    const orderDt = data.find((order) => order._id === orderId);
    setSelectedOrder(orderDt);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  function MyOrderDetailModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Order details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="od-items-title od-items-item">
            <p>
              <b>Image</b>
            </p>
            <p>
              <b>Name</b>
            </p>
            <p>
              <b>Price</b>
            </p>
            <p>
              <b>Quantiy</b>
            </p>
            <p>
              <b>Item total</b>
            </p>
          </div>
          <hr />
          {props.selectedOrder?.items.map((item, index) => {
            return (
              <div key={item._id}>
                <div className="od-items-title od-items-item">
                  <img src={item.image.url} alt="" />
                  <p>{item.name}</p>
                  <p>{item.price}$</p>
                  <p>{item.quantity}</p>
                  <p>{item.price * item.quantity}$</p>
                </div>
                <hr />
              </div>
            );
          })}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h6>Delivery address</h6>
              <p style={{ margin: 0, padding: 0 }}>
                {props.selectedOrder?.address.fullName}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "#495057",
                  margin: 0,
                  padding: 0,
                }}
              >
                {props.selectedOrder?.address.phone}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "#495057",
                  margin: 0,
                  padding: 0,
                }}
              >
                {props.selectedOrder?.address?.street},{" "}
                {props.selectedOrder?.address?.ward},
                {props.selectedOrder?.address?.district},{" "}
                {props.selectedOrder?.address?.city}
              </p>
              <p style={{ fontSize: 12, color: "#6c757d" }}>
                Created at:{" "}
                {new Date(props.selectedOrder?.date).toLocaleString()}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  color: "#495057",
                  margin: 0,
                  padding: 0,
                }}
              >
                Payment method:{" "}
                {props.selectedOrder?.paymentMethod?.toUpperCase()}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "#495057",
                  margin: 0,
                  padding: 0,
                }}
              >
                Payment status:{" "}
                {props.selectedOrder?.payment ? "Paid" : "Not Paid"}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "#495057",
                  margin: 0,
                  padding: 0,
                }}
              >
                Order status: {props.selectedOrder?.status}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "#495057",
                  margin: 0,
                  padding: 0,
                }}
              >
                Subtotal: {(props.selectedOrder?.amount - 2).toFixed(0, 2)}$
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "#495057",
                  margin: 0,
                  padding: 0,
                }}
              >
                Shipping fee: 2$
              </p>
              <p
                style={{
                  margin: 0,
                  padding: 0,
                  color: "tomato",
                }}
              >
                Total: {props.selectedOrder?.amount}$
              </p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="ctn">
        {data.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              <input hidden name="orderId" value={order._id} />
              <img src={assets.parcel_icon} alt="" />
              <p>
                {order.items.map((item, index) => {
                  if (index == order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p>${order.amount}</p>
              <p>Items: {order.items.length}</p>
              <p>
                <span>&#x25cf;</span> <b>{order.status}</b>
              </p>
              <button
                onClick={(e) => {
                  trackOrder(e);
                  setModalShow(true);
                }}
              >
                Track Order
              </button>

              <MyOrderDetailModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                selectedOrder={selectedOrder}
                backdropClassName="transparent-backdrop"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
