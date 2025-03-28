import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { OAuth2Client } from "google-auth-library";

const client_id = process.env.GG_CLIENT_ID;
const client = new OAuth2Client(client_id);

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: client_id,
  });
  // Payload thông tin tài khoản
  const payload = ticket.getPayload();
  return payload;
}

// Google Login
const googleLogin = async (req, res) => {
  console.log("Request Body:", req.body); // Kiểm tra dữ liệu nhận từ client

  const { token } = req.body;
  console.log("Token nhận được từ client:", token);
  if (!token) {
    return res.json({
      success: false,
      message: "Token không được gửi từ client",
    });
  }
  try {
    const payload = await verify(token);
    console.log("Payload sau verify:", payload);

    const { email, name, sub } = payload;
    let account = await userModel.findOne({ email });

    if (!account) {
      account = await userModel.create({
        email,
        name,
        googleId: sub,
        role: "customer",
      });
    } else if (!account.googleId) {
      account.googleId = sub;
      await account.save();
    }

    return res.json({ success: true, user: account });
  } catch (error) {
    console.log("Lỗi verify Google token:", error);
    return res.json({ success: false, message: "Google login failed" });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }
    const token = createToken(user._id);
    res.json({
      success: true,
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Tạo JWT Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Tạo User mới
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Kiểm tra xem email đã tồn tại chưa
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Kiểm tra email hợp lệ
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    // Kiểm tra độ mạnh của mật khẩu
    if (password.length < 8) {
      return res.json({ success: false, message: "Password too weak" });
    }

    // Mặc định vai trò là "customer" nếu không có role hoặc role không phải admin
    const userRole = role === "admin" ? "admin" : "customer";

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({
      success: true,
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Đăng ký user từ homepage (Mặc định customer)
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Kiểm tra user đã tồn tại chưa
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Kiểm tra validation
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Password too weak" });
    }

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Lấy tất cả user (chỉ admin có quyền)
const getAllUsers = async (req, res) => {
  try {  

    // Tìm tất cả người dùng và loại bỏ trường password
    const users = await userModel.find({}).select("-password");

    return res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.json({
      success: false,
      message: "Server error occurred while fetching users",
    });
  }
};

// Lấy users theo role (admin/customer)
const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    // Kiểm tra role của user gửi request
    if (req.user && req.user.role !== "admin") {
      return res.json({
        success: false,
        message: "Only admin can access this resource",
      });
    }

    // Kiểm tra role có hợp lệ không
    if (!["admin", "customer"].includes(role)) {
      return res.json({
        success: false,
        message:
          'Invalid role specified. Role must be either "admin" or "customer"',
      });
    }

    // Tìm users theo role và loại bỏ trường password
    const users = await userModel.find({ role }).select("-password");

    return res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users by role:", error);
    return res.json({
      success: false,
      message: "Server error occurred while fetching users",
    });
  }
};

// Export các function
export {
  googleLogin,
  loginUser,
  registerUser,
  createUser,
  getAllUsers,
  getUsersByRole,
};
