import React, { useContext, useEffect, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext.js";
import FoodItem from "../FoodItem/FoodItem.js";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [filteredItems, setFilteredItems] = useState([]);

  // Lọc danh sách món ăn khi category hoặc food_list thay đổi
  useEffect(() => {
    if (food_list && food_list.length > 0) {
      const filtered =
        category === "All"
          ? food_list
          : food_list.filter((item) => item.category === category);

      setFilteredItems(filtered);
    }
  }, [category, food_list]);

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p>No dishes available in this category</p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
