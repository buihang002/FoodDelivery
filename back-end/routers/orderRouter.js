import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  placeOrder,
  userOrders,
  listOrders,
  updateOrderStatus,
  verifyStripePayment,
  verifyVNPayPayment,
} from "../controllers/orderController.js";

const orderRouter = express.Router();
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyStripePayment);
orderRouter.get("/verify", verifyVNPayPayment);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.put("/update-status/:id", updateOrderStatus);
export default orderRouter;
