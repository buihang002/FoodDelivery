const express = require("express");
const { register, login, getAllUsers } = require("../controller/users.js");
const { verifyToken } = require("../middleware/authorization.js");
const userRouter = express.Router();
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/", verifyToken, getAllUsers);

module.exports = userRouter;
.

// đưa ra toàn bộ danh sách ng dùng
