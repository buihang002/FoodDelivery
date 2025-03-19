import React, { useContext, useEffect, useState } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      //Stripe
      const success = searchParams.get("success");
      const orderId = searchParams.get("orderId");

      //VNPay
      const urlParams = new URLSearchParams(window.location.search);
      const queryObject = Object.fromEntries(urlParams.entries());

      let res;
      if (queryObject.vnp_TxnRef) {
        //VNPAY
        res = await axios.get(`${url}/api/order/verify`, {
          params: queryObject,
        });
      } else {
        //Stripe
        res = await axios.post(url + "/api/order/verify", {
          success,
          orderId,
        });
      }

      console.log(res.data);

      if (res.data.success) {
        navigate("/myorders");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
