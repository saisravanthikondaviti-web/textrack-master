function ProductCard({ product }) {
  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <button className="btn">Add to Cart</button>
    </div>
  );
}

export default ProductCard;