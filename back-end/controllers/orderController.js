import { VNPAY_HASH_SECRET } from "../config/vnpay.js";
import Order from "../models/order.js";
import User from "../models/userModel.js";
import {
  processStripePayment,
  processVNPayPayment,
  sortParams,
} from "./paymentController.js";
import qs from "qs";
import crypto from "crypto";

//Place order for front end
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, paymentMethod } = req.body;

    const newOrder = new Order({
      userId: userId,
      items: items,
      amount: amount,
      address: address,
      paymentMethod: paymentMethod,
      status: "Food processing",
    });

    await newOrder.save();
    await User.findByIdAndUpdate(userId, { cartData: {} });

    let session_url;
    if (paymentMethod === "stripe") {
      session_url = await processStripePayment(newOrder, items);
    } else if (paymentMethod === "vnpay") {
      session_url = processVNPayPayment(newOrder, amount);
    } else if (paymentMethod === "momo") {
    } else if (paymentMethod === "COD") {
      session_url = "http://localhost:3000/myorders";
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment method" });
    }

    res.json({
      success: true,
      session_url,
      message: "Order created successfully!",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyStripePayment = async (req, res) => {
  try {
    const { orderId, success } = req.body;
    if (!orderId) {
      return res.json({ success: false, message: "Missing orderId" });
    }

    if (success === "true") {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      return res.json({ success: true, message: "Paid via Stripe" });
    } else {
      await Order.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Not Paid via Stripe" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyVNPayPayment = async (req, res) => {
  try {
    const vnpParams = req.query;

    const orderId = vnpParams.vnp_TxnRef;
    const responseCode = vnpParams.vnp_ResponseCode;
    const secureHash = vnpParams.vnp_SecureHash;

    if (!orderId) {
      return res.json({ success: false, message: "Missing VNPay orderId" });
    }

    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    const secretKey = VNPAY_HASH_SECRET;

    const sortedParams = sortParams(vnpParams);

    const urlParams = new URLSearchParams();
    for (let [key, value] of Object.entries(sortedParams)) {
      urlParams.append(key, value);
    }

    const querystring = urlParams.toString();

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(querystring, "utf-8")).digest("hex");

    if (secureHash !== signed) {
      return res.json({ success: false, message: "Invalid VNPay Signature" });
    }

    if (responseCode === "00") {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      return res.json({ success: true, message: "Paid via VNPay" });
    } else {
      await Order.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Not Paid via VNPay" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//user orders
const userOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.body.userId });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

//admin orders
const listOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Thêm function mới
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order status updated", data: order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Export thêm function mới
export {
  placeOrder,
  verifyStripePayment,
  verifyVNPayPayment,
  userOrders,
  listOrders,
  updateOrderStatus,
};
