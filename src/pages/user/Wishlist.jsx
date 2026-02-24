import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../services/firebase";

const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    if (!user) return;

    const wishlistSnap = await getDoc(doc(db, "wishlist", user.uid));

    if (!wishlistSnap.exists()) {
      setWishlistProducts([]);
      return;
    }

    const productIds = wishlistSnap.data().items || [];

    const productsSnap = await getDocs(collection(db, "products"));
    const allProducts = [];
    productsSnap.forEach((doc) => {
      allProducts.push({ id: doc.id, ...doc.data() });
    });

    const filtered = allProducts.filter((product) =>
      productIds.includes(product.id)
    );

    setWishlistProducts(filtered);
  };

  const removeFromWishlist = async (productId) => {
    const wishlistRef = doc(db, "wishlist", user.uid);
    const snap = await getDoc(wishlistRef);

    const updatedItems = snap
      .data()
      .items.filter((id) => id !== productId);

    await updateDoc(wishlistRef, {
      items: updatedItems,
    });

    fetchWishlist();
  };

  const addToCart = (product) => {
    alert(`Added ${product.name} to cart`);
    // You can connect this with your cart logic
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>❤️ My Wishlist</h2>

      {wishlistProducts.length === 0 ? (
        <p>No favorite fabrics yet.</p>
      ) : (
        <div style={gridStyle}>
          {wishlistProducts.map((product) => (
            <div key={product.id} style={cardStyle}>
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt="fabric"
                  width="100%"
                  style={{ borderRadius: "8px" }}
                />
              )}

              <h4>{product.name}</h4>
              <p>₹{product.price}</p>

              <button
                style={cartBtn}
                onClick={() => addToCart(product)}
              >
                🛒 Add to Cart
              </button>

              <button
                style={removeBtn}
                onClick={() =>
                  removeFromWishlist(product.id)
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------- Styles ---------- */

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};

const cardStyle = {
  background: "#ffffff",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  textAlign: "center",
};

const cartBtn = {
  background: "#4caf50",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: "5px",
};

const removeBtn = {
  background: "#e53935",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "5px",
};

export default Wishlist;