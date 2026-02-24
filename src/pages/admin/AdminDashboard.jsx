import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../services/firebase";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    revenue: 0,
    popularCategory: "N/A",
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const ordersSnap = await getDocs(collection(db, "orders"));

      let totalRevenue = 0;
      let categoryCount = {};

      ordersSnap.forEach((doc) => {
        const order = doc.data();
        totalRevenue += order.totalAmount || 0;

        const category = order.category || "Others";
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      const popularCategory =
        Object.keys(categoryCount).length > 0
          ? Object.keys(categoryCount).reduce((a, b) =>
              categoryCount[a] > categoryCount[b] ? a : b
            )
          : "N/A";

      setStats({
        users: usersSnap.size,
        orders: ordersSnap.size,
        revenue: totalRevenue,
        popularCategory,
      });

      // Fetch Recent Orders
      const recentQuery = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc"),
        limit(5)
      );

      const recentSnap = await getDocs(recentQuery);
      const recentList = [];

      recentSnap.forEach((doc) => {
        recentList.push({ id: doc.id, ...doc.data() });
      });

      setRecentOrders(recentList);
    };

    fetchDashboardData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>👩‍💼 Admin Control Center</h2>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Users</h3>
          <p>{stats.users}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Orders</h3>
          <p>{stats.orders}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Revenue</h3>
          <p>₹{stats.revenue}</p>
        </div>

        <div style={cardStyle}>
          <h3>Most Popular Category</h3>
          <p>{stats.popularCategory}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ marginTop: "40px" }}>
        <h3>🕒 Recent Orders</h3>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id.slice(0, 6)}</td>
                <td>{order.userEmail || "N/A"}</td>
                <td>₹{order.totalAmount}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const cardStyle = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  textAlign: "center",
  fontSize: "18px",
  fontWeight: "bold",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "15px",
};

export default AdminDashboard;