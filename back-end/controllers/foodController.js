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

export { addFood };
