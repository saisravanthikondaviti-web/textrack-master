import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../styles/cart.css";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart
  } = useContext(CartContext);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Add some beautiful fabrics to begin ✨</p>
      </div>
    );
  }

  return (
    <section className="cart-page">
      <h2 className="cart-title">Your Cart</h2>

      <div className="cart-layout">
        {/* LEFT — ITEMS */}
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-card" key={item.id}>
              <img src={item.image} alt={item.name} />

              <div className="cart-info">
                <h3>{item.name}</h3>
                <p className="cart-category">{item.category}</p>
                <p className="cart-price">₹{item.price}</p>

                <div className="cart-qty">
                  <button onClick={() => decreaseQuantity(item.id)}>
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>
                    +
                  </button>
                </div>
              </div>

              <div className="cart-actions">
                <p className="cart-subtotal">
                  ₹{item.price * item.quantity}
                </p>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT — SUMMARY */}
        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Items</span>
            <span>{cart.length}</span>
          </div>

          <div className="summary-row">
            <span>Total</span>
            <span className="summary-total">₹{total}</span>
          </div>

          <button className="checkout-btn">
            Proceed to Checkout
          </button>

          <button className="clear-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    </section>
  );
}

export default Cart;