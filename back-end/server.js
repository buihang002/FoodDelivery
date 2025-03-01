import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.js";
import foodRouter from "./routers/foodRouter.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 9999;
app.use("/api/food", foodRouter);

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// For parsing application/json

connectDB();

app.get("/", (req, res) => {
  res.send("API working")
})
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
