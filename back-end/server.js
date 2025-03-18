import express from "express";
// import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.js";
import foodRouter from "./routers/foodRouter.js";
import userRouter from "./routers/userRoute.js";
import cartRouter from "./routers/cartRouter.js";
import "dotenv/config.js";
import orderRouter from "./routers/orderRouter.js";
import chatRouter from "./routers/chatRouter.js";
const app = express();
// dotenv.config();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Add your frontend URLs
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 9999;
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/chat", chatRouter);
// For parsing application/json

connectDB();

app.get("/", (req, res) => {
  res.send("API working");
});
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
