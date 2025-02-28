const express = require("express");
const userRouter = require("./auth_users.js");
const router = express.Router();

router.use("/users", userRouter);
module.exports = router;
.