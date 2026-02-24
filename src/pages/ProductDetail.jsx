import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const product = location.state?.product;

  if (!product) {
    return (
      <div style={{ textAlign: "center", marginTop: "80px", color: "white" }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate("/products")} style={{ marginTop: "20px" }}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="popup-overlay" onClick={() => navigate("/products")}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => navigate("/products")}>
          ✕
        </button>

        <div className="popup-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="popup-content">
          <h2>{product.name}</h2>
          <p className="category">{product.category}</p>
          <p className="price">₹{product.price}</p>
          <p className="description">{product.description}</p>

          <button className="primary-btn" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;