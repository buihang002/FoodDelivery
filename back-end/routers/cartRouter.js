import express from "express";

import {
  addToCart,
  getCart,
  removeItemFromCart,
  removeAllCart,
  removeFromCart,
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";
const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/removeItem", authMiddleware, removeItemFromCart);
cartRouter.post("/removeAllItem", authMiddleware, removeAllCart);
cartRouter.get("/get", authMiddleware, getCart);
cartRouter.get("/remove", authMiddleware, removeFromCart);
export default cartRouter;
