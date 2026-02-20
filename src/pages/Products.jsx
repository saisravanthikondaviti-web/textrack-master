import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";


// Textile keywords focused on fabrics
const textileKeywords = [
  "cotton fabric",
  "silk fabric",
  "wool fabric",
  "linen fabric",
  "home textile fabric",
  "scarves textile"
];

// Fallback images for missing categories
const fallbackImages = {
  Cotton: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
  Silk: "https://images.unsplash.com/photo-1602526212624-0be3d44f62a1",
  Wool: "https://images.unsplash.com/photo-1602526212568-0d5b6c6c59f9",
  Linen: "https://images.unsplash.com/photo-1588121421349-f7f03e24e4d0",
  Scarves: "https://images.unsplash.com/photo-1600185361554-7f537f3abf63",
  "Home Textiles": "https://images.unsplash.com/photo-1592878849120-6e52e2d8fa5b"
};

// Map keyword to category
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
    "Home Textiles"
  ];

  const UNSPLASH_KEY = "pNnM32pfVS32O67pIJn_fOFNs8kmSMT4oDe0mCOikSU"; // <-- Replace with your Access Key

  // Fetch textile products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let allProducts = [];

      for (const keyword of textileKeywords) {
        try {
          const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
              keyword
            )}&per_page=5&client_id=${UNSPLASH_KEY}`
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
              fallbackImages[getCategoryFromKeyword(keyword)]
          }));

          allProducts = [...allProducts, ...mappedProducts];
        } catch (error) {
          console.error("Error fetching from Unsplash:", error);
        }
      }

      setProducts(allProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Filter and search
  const filtered =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const searched = filtered.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Loading textile fabrics...
      </p>
    );

  return (
    <div className="container" style={{ background: "#fdf6e3" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Textile Fabrics Collection
      </h2>

      {/* Search & Filters */}
      <div
        className="filters"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: "25px"
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
            padding: "7px 12px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "200px",
            marginTop: "5px"
          }}
        />
      </div>

      {/* Products Grid */}
      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "25px"
        }}
      >
        {searched.map((item) => (
          <div className="card" key={item.id}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <p>
              {item.description.length > 50
                ? item.description.substring(0, 50) + "..."
                : item.description}
            </p>

            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <button className="btn" onClick={() => addToCart(item)}>
                Add to Cart
              </button>

              <Link
                to={`/product/${item.id}`}
                state={{ product: item }}
                style={{
                  padding: "8px 12px",
                  borderRadius: "5px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  textAlign: "center",
                  textDecoration: "none"
                }}
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;