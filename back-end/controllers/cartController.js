import userModel from "../models/userModel.js";

// thêm item vào cart

const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById({ _id: req.body.userId });
    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//xóa số lượng của 1 item

const removeItemFromCart = async (req, res) => {
  try {
    let userDate = await userModel.findById(req.body.userId);
    let cartData = await userDate.cartData;
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
// lấy ra item

const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//remove all cart items
const removeAllCart = async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
    res.json({ success: true, message: "Removed All Cart Items" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
// remove toàn bộ 1 sản phẩm
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = userData.cartData; // Không gọi như hàm ()

    if (cartData.hasOwnProperty(req.body.itemId)) {
      delete cartData[req.body.itemId];
      await userModel.findByIdAndUpdate(req.body.userId, { cartData });
      return res.json({ success: true, message: "Item removed from cart" });
    }

    res.json({ success: false, message: "Item not found in cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export {
  addToCart,
  removeItemFromCart,
  getCart,
  removeAllCart,
  removeFromCart,
};
