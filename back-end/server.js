import express from "express";
// import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cookieParser from "cookie-parser";
// import { connectDB } from "./config/db.js";
import foodRouter from "./routers/foodRouter.js";
import userRouter from "./routers/userRoute.js";
import cartRouter from "./routers/cartRouter.js";
// import "dotenv/config.js";
import { connectDB } from "./config/db.js";

// Kết nối đến MongoDB trước khi khởi chạy server
connectDB();

import orderRouter from "./routers/orderRouter.js";
import dotenv from "dotenv";
dotenv.config();
import chatRouter from "./routers/chatRouter.js";
const app = express();
// dotenv.config();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://localhost:3001"], // Add your frontend URLs
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Cấu hình Passport với Google OAuth2
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GG_CLIENT_ID,
      clientSecret: process.env.GG_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Tìm hoặc tạo user trong database
        const user = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        };
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
// Lưu user vào session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Route Google Login
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback từ Google
app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(req.user, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .cookie("token", token, { httpOnly: true })
      .redirect("http://localhost:3000/dashboard");
  }
);

// Kiểm tra user
app.get("/api/auth/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    res.json(user);
  });
});

const PORT = process.env.PORT || 9999;
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/chat", chatRouter);
// For parsing application/json
console.log("Google Client ID:", process.env.GG_CLIENT_ID);
console.log("Google Client Secret:", process.env.GG_CLIENT_SECRET);
connectDB();

app.get("/", (req, res) => {
  res.send("API working");
});
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
