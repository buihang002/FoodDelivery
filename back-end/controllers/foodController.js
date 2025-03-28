import foodModel from "../models/foodModel.js";
import cloudinary from "../utils/cloudinary.js";

const addFood = async (req, res) => {
  console.log(req.file);

  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "foods",
  });

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//all food list and filter by category
const listFood = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    const foods = await foodModel.find(filter);
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//all food list
const removeFood = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await foodModel.findById(id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    if (food.image && food.image.public_id) {
      await cloudinary.uploader.destroy(food.image.public_id);
    }

    await foodModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addFood, listFood, removeFood };
