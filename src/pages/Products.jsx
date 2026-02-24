import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

/* ---------- Textile Keywords ---------- */
const textileKeywords = [
  "cotton fabric",
  "silk fabric",
  "wool fabric",
  "linen fabric",
  "home textile fabric",
  "scarves textile",
];

/* ---------- Fallback Images ---------- */
const fallbackImages = {
  Cotton: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
  Silk: "https://images.unsplash.com/photo-1602526212624-0be3d44f62a1",
  Wool: "https://images.unsplash.com/photo-1602526212568-0d5b6c6c59f9",
  Linen: "https://images.unsplash.com/photo-1588121421349-f7f03e24e4d0",
  Scarves: "https://images.unsplash.com/photo-1600185361554-7f537f3abf63",
  "Home Textiles":
    "https://images.unsplash.com/photo-1592878849120-6e52e2d8fa5b",
};

const getCategoryFromKeyword = (keyword) => {
  if (keyword.includes("cotton")) return "Cotton";
  if (keyword.includes("silk")) return "Silk";
  if (keyword.includes("wool")) return "Wool";
  if (keyword.includes("linen")) return "Linen";
  if (keyword.includes("scarf")) return "Scarves";
  if (keyword.includes("home")) return "Home Textiles";
  return "Fabrics";
};

function Products() {
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All",
    "Cotton",
    "Silk",
    "Wool",
    "Linen",
    "Scarves",
    "Home Textiles",
  ];

  const UNSPLASH_KEY = "pNnM32pfVS32O67pIJn_fOFNs8kmSMT4oDe0mCOikSU";

  /* ---------- Fetch Products ---------- */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let allProducts = [];

      for (const keyword of textileKeywords) {
        try {
          const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
              keyword,
            )}&per_page=5&client_id=${UNSPLASH_KEY}`,
          );
          const data = await response.json();

          const mappedProducts = data.results.map((item) => ({
            id: item.id,
            name: item.alt_description
              ? item.alt_description.charAt(0).toUpperCase() +
                item.alt_description.slice(1)
              : getCategoryFromKeyword(keyword),
            description:
              "High-quality textile fabric, perfect for your collection.",
            category: getCategoryFromKeyword(keyword),
            price: Math.floor(Math.random() * 2000) + 200,
            image:
              item.urls.small ||
              fallbackImages[getCategoryFromKeyword(keyword)],
          }));

          allProducts = [...allProducts, ...mappedProducts];
        } catch (error) {
          console.error("Unsplash error:", error);
        }
      }

      setProducts(allProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  /* ---------- Filtering ---------- */
  const filtered =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const searched = filtered.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "80px", color: "#9ca3af" }}>
        Loading textile fabrics...
      </p>
    );

  return (
    <section className="products-section">
      <div className="container">
        {/* Heading */}
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "2rem",
            color: "#fff",
          }}
        >
          Textile Fabrics Collection
        </h2>

        {/* Filters + Search */}
        <div
          className="filters"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            marginBottom: "30px",
          }}
        >
          <div>
            {categories.map((cat) => (
              <button
                key={cat}
                className={cat === selectedCategory ? "active" : ""}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search fabrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              outline: "none",
              width: "220px",
            }}
          />
        </div>

        {/* Products Grid */}
        <div className="grid">
          {searched.map((item) => (
            <div className="card" key={item.id}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.category}</p>
              <p>₹{item.price}</p>
              <p>{item.description}</p>

              <div className="card-actions">
                <button className="btn" onClick={() => addToCart(item)}>
                  Add to Cart
                </button>

                <Link to={`/product/${item.id}`} state={{ product: item }}>
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>

        <footer className="footer">
          <div className="footer-container">
            <div className="footer-brand">
              <h3>TexTrack</h3>
              <p>
                AI-powered textile discovery platform helping you explore
                premium fabrics with intelligence and style.
              </p>

              <div className="footer-social">
                <span>🌐</span>
                <span>📸</span>
                <span>💼</span>
              </div>
            </div>

            <div className="footer-links">
              <h4>Quick Links</h4>
              <a href="#hero">Home</a>
              <Link to="/products">Products</Link>
              <a href="#about">About</a>
              <a href="#faq">FAQ</a>
              <a href="#contact">Contact</a>
            </div>

            <div className="footer-platform">
              <h4>Platform</h4>
              <p>AI Fabric Intelligence</p>
              <p>Secure Order Tracking</p>
              <p>Modern UI Experience</p>
              <p>Built with Firebase</p>
            </div>
          </div>

          <div className="footer-bottom">
            © 2026 TexTrack • Designed by Sravanthi Kondaviti
          </div>
        </footer>
      </div>
    </section>
  );
}

export default Products;
