import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../services/firebase";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const snap = await getDocs(collection(db, "orders"));
    const orderList = [];
    snap.forEach((doc) => {
      orderList.push({ id: doc.id, ...doc.data() });
    });
    setOrders(orderList);
  };

  const updateStatus = async (orderId, newStatus) => {
    await updateDoc(doc(db, "orders", orderId), {
      status: newStatus,
    });
    fetchOrders();
  };

  const cancelOrder = async (orderId) => {
    await updateDoc(doc(db, "orders", orderId), {
      status: "Cancelled",
    });
    fetchOrders();
  };

  const refundOrder = async (orderId) => {
    await updateDoc(doc(db, "orders", orderId), {
      status: "Refunded",
    });
    fetchOrders();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Order Management</h2>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Update</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id.slice(0, 6)}</td>
              <td>{order.userEmail || "N/A"}</td>
              <td>₹{order.totalAmount}</td>

              <td>
                <span style={statusBadge(order.status)}>
                  {order.status}
                </span>
              </td>

              <td>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order.id, e.target.value)
                  }
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
              </td>

              <td>
                <button
                  style={dangerBtn}
                  onClick={() => cancelOrder(order.id)}
                >
                  Cancel
                </button>

                <button
                  style={warningBtn}
                  onClick={() => refundOrder(order.id)}
                >
                  Refund
                </button>

                <button
                  style={viewBtn}
                  onClick={() => setSelectedOrder(order)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Order Details</h3>
            <p><strong>User:</strong> {selectedOrder.userEmail}</p>
            <p><strong>Total:</strong> ₹{selectedOrder.totalAmount}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Category:</strong> {selectedOrder.category}</p>

            <button
              style={closeBtn}
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- STYLES ---------- */

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const dangerBtn = {
  background: "#e53935",
  color: "white",
  border: "none",
  padding: "6px 10px",
  marginRight: "5px",
  borderRadius: "5px",
  cursor: "pointer",
};

const warningBtn = {
  background: "#ff9800",
  color: "white",
  border: "none",
  padding: "6px 10px",
  marginRight: "5px",
  borderRadius: "5px",
  cursor: "pointer",
};

const viewBtn = {
  background: "#2196f3",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer",
};

const closeBtn = {
  background: "#333",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox = {
  background: "white",
  padding: "30px",
  borderRadius: "10px",
  width: "300px",
};

const statusBadge = (status) => {
  const colors = {
    Pending: "#757575",
    Processing: "#2196f3",
    Shipped: "#9c27b0",
    Delivered: "#4caf50",
    Cancelled: "#e53935",
    Refunded: "#ff9800",
  };

  return {
    background: colors[status] || "#ccc",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
  };
};

export default OrderManagement;