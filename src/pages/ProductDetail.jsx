import { useParams, useLocation } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductDetail() {
  const { addToCart } = useContext(CartContext);
  const location = useLocation();

  const product = location.state?.product;

  if (!product)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Product not found!
      </p>
    );

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "0 auto",
        background: "#fff7e6",
        borderRadius: "10px"
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "8px" }}
      />
      <h2>{product.name}</h2>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Price:</strong> ₹{product.price}</p>
      <p>{product.description}</p>
      <button
        onClick={() => addToCart(product)}
        style={{
          padding: "10px 15px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "15px"
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductDetail;