import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [data, setData] = useState({
    fullName: "",
    email: "",
    ward: "",
    district: "",
    city: "",
    phone: "",
    contry: "Vietnam",
    street: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    try {
      event.preventDefault();
      let orderItems = [];
      food_list.map((item) => {
        if (cartItems[item._id] > 0) {
          let itemInfo = item;
          itemInfo["quantity"] = cartItems[item._id];
          orderItems.push(itemInfo);
        }
      });
      let orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + 2,
        paymentMethod,
      };
      let res = await axios.post(url + "/api/order/place", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const { session_url } = res.data;
        window.location.replace(session_url);
      } else {
        alert("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} class="place-order">
      <div class="place-order-left">
        <p class="title">Delivery Information</p>

        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            required
            name="fullName"
            onChange={onChangeHandler}
            value={data.fullName}
            type="text"
            placeholder="Full name"
          />
        </div>

        <div>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            required
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Email address"
          />
        </div>
        <div class="multi-fields">
          <div>
            <label htmlFor="city">City</label>
            <input
              id="city"
              required
              name="city"
              onChange={onChangeHandler}
              value={data.city}
              type="text"
              placeholder="City"
            />
          </div>
          <div>
            <label htmlFor="district">District</label>
            <input
              id="district"
              required
              name="district"
              onChange={onChangeHandler}
              value={data.district}
              type="text"
              placeholder="District"
            />
          </div>
        </div>
        <div class="multi-fields">
          <div>
            <label htmlFor="ward">Ward</label>
            <input
              id="ward"
              required
              name="ward"
              onChange={onChangeHandler}
              value={data.ward}
              type="text"
              placeholder="Ward"
            />
          </div>

          <div>
            <label htmlFor="street">Street</label>
            <input
              id="street"
              required
              name="street"
              onChange={onChangeHandler}
              value={data.street}
              type="text"
              placeholder="Street"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            required
            name="phone"
            onChange={onChangeHandler}
            value={data.phone}
            type="text"
            placeholder="Phone"
          />
        </div>
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()}$</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 2}$</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}$
              </b>
            </div>
          </div>

          <div className="payment-method">
            <p>Choose Payment Method:</p>
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                required
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <img src="cod.png" alt="COD" className="payment-icon" />
              Cash on Delivery
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="vnpay"
                required
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <img src="vnpay.png" alt="VNPay" className="payment-icon" />
              VNPAY wallet
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="momo"
                required
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <img src="momo.png" alt="momo" className="payment-icon" />
              Momo wallet
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                required
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <img src="stripe.png" alt="Stripe" className="payment-icon" />
              Stripe
            </label>
          </div>

          <button type="submit" style={{ width: "100%" }}>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
