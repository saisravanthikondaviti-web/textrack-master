import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../services/firebase";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", user.email)
    );

    const snap = await getDocs(q);

    let totalSpent = 0;
    const ordersList = [];

    snap.forEach((doc) => {
      const order = doc.data();
      totalSpent += order.totalAmount || 0;
      ordersList.push({ id: doc.id, ...order });
    });

    setStats({
      totalOrders: snap.size,
      totalSpent,
    });

    setRecentOrders(
      ordersList
        .sort(
          (a, b) =>
            b.createdAt?.toDate() - a.createdAt?.toDate()
        )
        .slice(0, 3)
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>👋 Welcome, {auth.currentUser?.email}</h2>

      {/* Stats Cards */}
      <div style={cardContainer}>
        <div style={card}>
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>

        <div style={card}>
          <h3>Total Spent</h3>
          <p>₹{stats.totalSpent}</p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div style={{ marginTop: "30px" }}>
        <h3>⚡ Quick Access</h3>

        <div style={cardContainer}>
          <div
            style={navCard}
            onClick={() => navigate("/profile")}
          >
            👤 Profile
          </div>

          <div
            style={navCard}
            onClick={() => navigate("/orders")}
          >
            📦 My Orders
          </div>

          <div
            style={navCard}
            onClick={() => navigate("/wishlist")}
          >
            ❤️ Wishlist
          </div>

          <div
            style={navCard}
            onClick={() => navigate("/purchase-summary")}
          >
            💳 Purchase Summary
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div style={{ marginTop: "40px" }}>
        <h3>🕒 Recent Orders</h3>

        {recentOrders.length === 0 ? (
          <p>No recent orders.</p>
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

const navCard = {
  background: "#f5f5f5",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.2s",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "15px",
};

export default UserDashboard;