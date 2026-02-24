import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, storage, serverTimestamp } from "../../services/firebase";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const snap = await getDocs(collection(db, "products"));
    const list = [];
    snap.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    setProducts(list);
  };

  const handleImageUpload = async () => {
    if (!image) return null;

    const imageRef = ref(storage, `products/${image.name}`);
    await uploadBytes(imageRef, image);
    const url = await getDownloadURL(imageRef);
    return url;
  };

  const handleSubmit = async () => {
    const imageUrl = await handleImageUpload();

    if (editingId) {
      await updateDoc(doc(db, "products", editingId), {
        ...form,
        price: Number(form.price),
        imageUrl: imageUrl || undefined,
      });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "products"), {
        ...form,
        price: Number(form.price),
        imageUrl,
        inStock: true,
        createdAt: serverTimestamp(),
      });
    }

    setForm({ name: "", price: "", category: "", description: "" });
    setImage(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  const toggleStock = async (id, currentStatus) => {
    await updateDoc(doc(db, "products", id), {
      inStock: !currentStatus,
    });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
    });
    setEditingId(product.id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧵 Product Management</h2>

      {/* Product Form */}
      <div style={formStyle}>
        <input
          placeholder="Fabric Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button onClick={handleSubmit}>
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </div>

      {/* Product Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt="fabric"
                    width="60"
                  />
                )}
              </td>
              <td>{product.name}</td>
              <td>₹{product.price}</td>
              <td>{product.category}</td>

              <td>
                <button
                  onClick={() =>
                    toggleStock(product.id, product.inStock)
                  }
                  style={
                    product.inStock ? inStockBtn : outStockBtn
                  }
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </button>
              </td>

              <td>
                <button
                  style={editBtn}
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>

                <button
                  style={deleteBtn}
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ---------- Styles ---------- */

const formStyle = {
  display: "grid",
  gap: "10px",
  marginBottom: "30px",
  maxWidth: "400px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const editBtn = {
  background: "#2196f3",
  color: "white",
  border: "none",
  padding: "5px 10px",
  marginRight: "5px",
  borderRadius: "5px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#e53935",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer",
};

const inStockBtn = {
  background: "#4caf50",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer",
};

const outStockBtn = {
  background: "#9e9e9e",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default ProductManagement;