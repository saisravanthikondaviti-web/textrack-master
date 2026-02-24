import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../services/firebase";

const PurchaseSummary = () => {
  const [summary, setSummary] = useState({
    totalSpent: 0,
    totalOrders: 0,
    favoriteCategory: "N/A",
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchPurchaseData();
  }, []);

  const fetchPurchaseData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", user.email)
    );

    const snap = await getDocs(q);

    let totalSpent = 0;
    let categoryMap = {};
    const ordersList = [];

    snap.forEach((doc) => {
      const order = doc.data();

      totalSpent += order.totalAmount || 0;

      const category = order.category || "Others";
      categoryMap[category] = (categoryMap[category] || 0) + 1;

      ordersList.push({ id: doc.id, ...order });
    });

    const favoriteCategory =
      Object.keys(categoryMap).length > 0
        ? Object.keys(categoryMap).reduce((a, b) =>
            categoryMap[a] > categoryMap[b] ? a : b
          )
        : "N/A";

    setSummary({
      totalSpent,
      totalOrders: snap.size,
      favoriteCategory,
    });

    setRecentOrders(
      ordersList
        .sort(
          (a, b) =>
            b.createdAt?.toDate() - a.createdAt?.toDate()
        )
        .slice(0, 5)
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>💳 Purchase Summary</h2>

      {/* Summary Cards */}
      <div style={cardContainer}>
        <div style={card}>
          <h3>Total Spent</h3>
          <p>₹{summary.totalSpent}</p>
        </div>

        <div style={card}>
          <h3>Total Orders</h3>
          <p>{summary.totalOrders}</p>
        </div>

        <div style={card}>
          <h3>Favorite Category</h3>
          <p>{summary.favoriteCategory}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ marginTop: "40px" }}>
        <h3>🕒 Recent Purchases</h3>

        {recentOrders.length === 0 ? (
          <p>No purchases yet.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id.slice(0, 6)}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

/* ---------- Styles ---------- */

const cardContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};

const card = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  textAlign: "center",
  fontSize: "18px",
  fontWeight: "bold",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "15px",
};

export default PurchaseSummary;