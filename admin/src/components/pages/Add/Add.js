import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../../assets/assets.js";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("image", image);
      
      const response = await axios.post(`${url}/api/food/add`, formData);
      
      if (response.data.success) {
        toast.success("Product added successfully!");
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
        });
        setImage(false);
      } else {
        toast.error(response.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("An error occurred while adding the product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-container">
      <div className="add-header">
        <h2>Add New Product</h2>
        <p>Create a new food item to add to your menu</p>
      </div>
      
      <form className="add-form" onSubmit={onSubmitHandler}>
        <div className="form-grid">
          <div className="form-left">
            <div className="add-img-upload">
              <p>Product Image</p>
              <label htmlFor="image" className="upload-area">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Product preview"
                    className="preview-image"
                  />
                ) : (
                  <>
                    <img src={assets.upload_area} alt="Upload area" />
                    <p>Click to upload image</p>
                  </>
                )}
              </label>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
                required
                accept="image/*"
              />
            </div>
          </div>
          
          <div className="form-right">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                id="name"
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                name="name"
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Product Description</label>
              <textarea
                id="description"
                onChange={onChangeHandler}
                value={data.description}
                name="description"
                rows="4"
                placeholder="Describe your product"
                required
              ></textarea>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select 
                  id="category"
                  onChange={onChangeHandler} 
                  name="category"
                  value={data.category}
                >
                  <option value="Salad">Salad</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Deserts">Deserts</option>
                  <option value="Sandwich">Sandwich</option>
                  <option value="Cake">Cake</option>
                  <option value="Pure Veg">Pure Veg</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Noodles">Noodles</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  id="price"
                  onChange={onChangeHandler}
                  value={data.price}
                  type="number"
                  name="price"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn">Cancel</button>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
