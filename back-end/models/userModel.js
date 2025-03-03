import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, unique: true },
    cartData: { type: Object, default: {} },
  },
  { minimize: false }
);
const userModel = mongoose.models.users || mongoose.model("users", userSchema);
export default userModel;
