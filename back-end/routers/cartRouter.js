import express from "express";

import {
  addToCart,
  removeItemFromCart,
  getCart,
  removeAllCart,
  removeFromCart,
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";
const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeItemFromCart);
cartRouter.get("/get", authMiddleware, getCart);
cartRouter.post("/removeAll", authMiddleware, removeAllCart);
cartRouter.post("/removeItem", authMiddleware, removeFromCart);
export default cartRouter;
