import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header.js";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu.js";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay.js";
import AppDownload from "../../components/AppDownload/AppDownload.js";

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div className="home-container">
      <div className="header-container">
        <Header />
      </div>
      <ExploreMenu category={category} setCategory={setCategory} />
      <AppDownload />
    </div>
  );
};

export default Home;
