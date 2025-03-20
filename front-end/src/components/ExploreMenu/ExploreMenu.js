import React, { useState, useContext } from "react";
import "./ExploreMenu.css";
import { StoreContext } from "../../context/StoreContext.js";
import FoodDisplay from "../FoodDisplay/FoodDisplay.js";

const ExploreMenu = () => {
  const { categories } = useContext(StoreContext);
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="explore-menu" id="explore-menu">
      <div className="explore-menu-title">
        <h2>Explore Our Menu</h2>
        <p>Choose from a diverse menu featuring a delectable array of dishes</p>
      </div>

      <div className="explore-menu-categories">
        <button
          className={selectedCategory === "All" ? "active" : ""}
          onClick={() => setSelectedCategory("All")}
        >
          All
        </button>

        {categories.map((category, index) => (
          <button
            key={index}
            className={selectedCategory === category ? "active" : ""}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <FoodDisplay category={selectedCategory} />
    </div>
  );
};

export default ExploreMenu;
