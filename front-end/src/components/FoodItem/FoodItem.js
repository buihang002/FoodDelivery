import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets.js";
import { StoreContext } from "../../context/StoreContext.js";
const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeItemFromCart, url } =
    useContext(StoreContext);
  return (
    <div className="food-item">
      <div class="food-item-img-container">
        <img className="food-item-image" src={image.url} alt="" />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div class="food-item-counter">
            <img
              onClick={() => removeItemFromCart(id)}
              src={assets.remove_icon_red}
              alt=""
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        )}
      </div>
      <div class="food-item-info">
        <div class="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p class="food-item-desc">{description}</p>
        <p class="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
