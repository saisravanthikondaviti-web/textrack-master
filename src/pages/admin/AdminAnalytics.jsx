import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminAnalytics = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [dailyOrders, setDailyOrders] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const ordersSnap = await getDocs(collection(db, "orders"));

      let revenueMap = {};
      let dailyMap = {};
      let categoryMap = {};

      ordersSnap.forEach((doc) => {
        const order = doc.data();
        const date = order.createdAt?.toDate()?.toLocaleDateString() || "Unknown";
        const amount = order.totalAmount || 0;
        const category = order.category || "Others";

        // Revenue per day
        revenueMap[date] = (revenueMap[date] || 0) + amount;

        // Orders per day
        dailyMap[date] = (dailyMap[date] || 0) + 1;

        // Category Sales
        categoryMap[category] = (categoryMap[category] || 0) + amount;
      });

      setRevenueData(
        Object.keys(revenueMap).map((key) => ({
          date: key,
          revenue: revenueMap[key],
        }))
      );

      setDailyOrders(
        Object.keys(dailyMap).map((key) => ({
          date: key,
          orders: dailyMap[key],
        }))
      );

      setCategoryData(
        Object.keys(categoryMap).map((key) => ({
          name: key,
          value: categoryMap[key],
        }))
      );
    };

    fetchAnalytics();
  }, []);

  const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#E91E63"];

  return (
    <div style={{ padding: "20px" }}>
      <h2>📈 Admin Analytics Dashboard</h2>

      {/* Revenue Chart */}
      <div style={{ marginTop: "40px" }}>
        <h3>Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#4CAF50" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Orders */}
      <div style={{ marginTop: "40px" }}>
        <h3>Daily Orders</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyOrders}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#2196F3" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Sales */}
      <div style={{ marginTop: "40px" }}>
        <h3>Category-wise Sales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminAnalytics;