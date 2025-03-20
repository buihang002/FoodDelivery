import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, unique: true },
    googleId: { type: String, unique: true, sparse: true }, // Thêm Google ID (chỉ khi login bằng Google)

    role: { type: String, enum: ["admin", "customer"], default: "customer" }, /// Mặc định là customer khi tạo mới
    cartData: { type: Object, default: {} },
  },
  { minimize: false, timestamps: true }
);
const userModel = mongoose.models.users || mongoose.model("users", userSchema);
export default userModel;
