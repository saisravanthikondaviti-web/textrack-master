import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Cart() {
  const { user } = useAuth();

  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    totalPrice
  } = useCart();

  // ✅ PLACE ORDER FUNCTION
const handleCheckout = async () => {
  if (!user) {
    alert("Please login to place order");
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  try {
    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      items: cart,
      total: totalPrice,
      status: "pending",
      createdAt: serverTimestamp()
    });

    alert("Order placed successfully 🎉");
    clearCart();

  } catch (error) {
    console.error("Order error:", error);
    alert("Failed to place order");
  }
};

  return (
    <div className="container">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="card" style={{ marginBottom: "15px" }}>
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button className="btn" onClick={() => decreaseQty(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button className="btn" onClick={() => increaseQty(item.id)}>+</button>
              </div>

              <p>Subtotal: ₹{item.price * item.quantity}</p>

              <button
                className="btn"
                style={{ background: "crimson" }}
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}

          <h3>Total: ₹{totalPrice}</h3>

          <button className="btn" onClick={clearCart}>
            Clear Cart
          </button>

          <button
            className="btn"
            style={{ marginLeft: "10px", background: "green" }}
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;