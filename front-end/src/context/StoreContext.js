import { createContext, useEffect, useState } from "react";

import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:9999";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [categories, setCategories] = useState([]);
  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      try {
        const response = await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("API Response:", response.data);
      } catch (error) {
        console.error("Error adding to cart:", error.response?.data || error);
      }
    }
  };
  const removeItemFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    if (token) {
      try {
        const response = await axios.post(
          url + "/api/cart/removeItem",
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("API Response:", response.data);
      } catch (error) {
        console.error(
          "Error removing from cart:",
          error.response?.data || error
        );
      }
    }
  };
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      delete newCart[itemId];
      return newCart;
    });
    if (token) {
      try {
        const response = await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("API Response:", response.data);
      } catch (error) {
        console.error(
          "Error removing from cart:",
          error.response?.data || error
        );
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;

    if (!cartItems || Object.keys(cartItems).length === 0) {
      return totalAmount;
    }

    for (const itemId of Object.keys(cartItems)) {
      if (cartItems[itemId] > 0) {
        let itemInfo = food_list.find((product) => product._id === itemId);

        if (itemInfo && itemInfo.price) {
          totalAmount += itemInfo.price * cartItems[itemId];
        } else {
          console.warn(`Sản phẩm không tìm thấy hoặc không có giá: ${itemId}`);
        }
      }
    }

    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");

      if (response.data && response.data.success && response.data.data) {
        setFoodList(response.data.data);

        // Extract unique categories
        if (response.data.data.length > 0) {
          const uniqueCategories = [
            ...new Set(
              response.data.data.map((item) => item.category).filter(Boolean)
            ),
          ];
          setCategories(uniqueCategories);
        }
      } else {
        console.error(
          "Failed to fetch food list:",
          response.data?.message || "Unknown error"
        );
        setFoodList([]);
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
      setFoodList([]);
    }
  };

  const loadCartData = async () => {
    try {
      const response = await axios.get(url + "/api/cart/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data);

      if (response.data.success) {
        setCartItems(response.data.cartData || []);
      } else {
        console.error("Failed to load cart:", response.data.message);
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("Stored token:", storedToken);

    if (storedToken) {
      setToken(storedToken);
    }
    fetchFoodList();
  }, []);
  useEffect(() => {
    const LoadData = async () => {
      await fetchFoodList();

      console.log("Token before loading cart:", token);

      if (token) {
        await loadCartData();
      }
    };

    if (token) {
      LoadData();
    }
  }, [token]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    url,
    token,
    setToken,
    getTotalCartAmount,
    removeItemFromCart,
    categories,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
