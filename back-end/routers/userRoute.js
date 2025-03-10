import express from "express";
import {
  loginUser,
  registerUser,
  createUser,
  googleLogin,
} from "../controllers/userController.js";
// const { verifyToken } = require("../middleware/authorization.js");
const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/createUser", createUser);
userRouter.post("/googleauth", googleLogin);
// userRouter.get("/", verifyToken, getAllUsers);
export default userRouter;
