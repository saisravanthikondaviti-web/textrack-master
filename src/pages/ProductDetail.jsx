import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductDetail() {
  const { addToCart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;

  /* ---------- If no product → go back safely ---------- */
  if (!product) {
    return (
      <div style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        flexDirection: "column",
        gap: "20px"
      }}>
        <h2>Product not found</h2>
        <button
          onClick={() => navigate("/products")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Back to Products
        </button>
      </div>
    );
  }

  /* ---------- Modal UI ---------- */
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(6px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        width: "90%",
        maxWidth: "900px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px",
        padding: "30px",
        color: "#fff",
        position: "relative"
      }}>
        {/* Close */}
        <button
          onClick={() => navigate("/products")}
          style={{
            position: "absolute",
            right: "15px",
            top: "10px",
            fontSize: "22px",
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          ✕
        </button>

        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: "350px",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "20px"
          }}
        />

        <h2>{product.name}</h2>
        <p style={{ opacity: 0.7 }}>{product.category}</p>
        <h3 style={{ marginTop: "10px" }}>₹{product.price}</h3>

        <p style={{ marginTop: "15px", lineHeight: 1.6 }}>
          {product.description}
        </p>

        <button
          onClick={() => addToCart(product)}
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            background: "#22c55e",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;