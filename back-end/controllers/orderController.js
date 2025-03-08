import Order from "../models/order.js";
import User from "../models/userModel.js";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../config/apiKey.js";

const stripe = new Stripe(STRIPE_SECRET_KEY);

//place user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:3000";

  try {
    const newOrder = new Order({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    //clear cart
    await User.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const exchangeRate = 25500;

    const line_items = req.body.items.map((item, index) => ({
      price_data: {
        currency: "vnd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * exchangeRate),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "vnd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: (exchangeRate * 2) / 3,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({
      success: true,
      session_url: session.url,
      message: "Order created successfully!",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await Order.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
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

export { placeOrder, verifyOrder, userOrders };
