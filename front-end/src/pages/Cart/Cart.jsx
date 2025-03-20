import { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets.js";
import { useNavigate } from "react-router-dom";
const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    addToCart,
    removeItemFromCart,
  } = useContext(StoreContext);
  const navigate = useNavigate();
  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list
          .filter((item) => cartItems[item._id] > 0)
          .map((item, index) => (
            <div key={item._id}>
              <div className="cart-items-title cart-items-item">
                <img src={item.image.url} alt="" />
                <p>{item.name}</p>
                <p>{item.price}</p>
                <div className="quantity-controls">
                  <img
                    onClick={() => removeItemFromCart(item._id)}
                    src={assets.remove_icon_red}
                    alt=""
                  />
                  <p>{cartItems[item._id]}</p>
                  <img
                    onClick={() => addToCart(item._id)}
                    src={assets.add_icon_green}
                    alt=""
                  />
                </div>
                <p>{item.price * cartItems[item._id]}</p>
                <p
                  onClick={() => removeFromCart(item._id, true)}
                  className="cross"
                >
                  x
                </p>
              </div>
              <hr />
            </div>
          ))}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details"></div>
            <p>Subtotal</p>
            <p>{getTotalCartAmount()}</p>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code,Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
