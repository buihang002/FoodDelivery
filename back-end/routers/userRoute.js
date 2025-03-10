import express from "express";
import {
  loginUser,
  registerUser,
  createUser,
} from "../controllers/userController.js";
// const { verifyToken } = require("../middleware/authorization.js");
const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/createUser", createUser);
// userRouter.get("/", verifyToken, getAllUsers);
export default userRouter;
