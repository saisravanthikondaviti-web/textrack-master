import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../services/firebase";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserOrders, setSelectedUserOrders] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    const list = [];
    snap.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    setUsers(list);
  };

  const toggleBlockUser = async (userId, currentStatus) => {
    await updateDoc(doc(db, "users", userId), {
      blocked: !currentStatus,
    });
    fetchUsers();
  };

  const changeRole = async (userId, newRole) => {
    await updateDoc(doc(db, "users", userId), {
      role: newRole,
    });
    fetchUsers();
  };

  const viewUserOrders = async (userEmail) => {
    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", userEmail)
    );

    const snap = await getDocs(q);
    const orders = [];
    snap.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    setSelectedUserOrders({ email: userEmail, orders });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>👥 User Management</h2>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Change Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>

              <td>
                <span style={roleBadge(user.role)}>
                  {user.role}
                </span>
              </td>

              <td>
                <span style={statusBadge(user.blocked)}>
                  {user.blocked ? "Blocked" : "Active"}
                </span>
              </td>

              <td>
                <select
                  value={user.role}
                  onChange={(e) =>
                    changeRole(user.id, e.target.value)
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>

              <td>
                <button
                  style={blockBtn}
                  onClick={() =>
                    toggleBlockUser(user.id, user.blocked)
                  }
                >
                  {user.blocked ? "Unblock" : "Block"}
                </button>

                <button
                  style={viewBtn}
                  onClick={() => viewUserOrders(user.email)}
                >
                  View Orders
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Orders Modal */}
      {selectedUserOrders && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Orders of {selectedUserOrders.email}</h3>

            {selectedUserOrders.orders.length === 0 ? (
              <p>No Orders Found</p>
            ) : (
              selectedUserOrders.orders.map((order) => (
                <div key={order.id} style={orderCard}>
                  <p><strong>Order ID:</strong> {order.id.slice(0, 6)}</p>
                  <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                </div>
              ))
            )}

            <button
              style={closeBtn}
              onClick={() => setSelectedUserOrders(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- Styles ---------- */

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const blockBtn = {
  background: "#e53935",
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
  padding: "25px",
  borderRadius: "10px",
  width: "350px",
  maxHeight: "400px",
  overflowY: "auto",
};

const orderCard = {
  background: "#f5f5f5",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
};

const roleBadge = (role) => ({
  background: role === "admin" ? "#4caf50" : "#757575",
  color: "white",
  padding: "4px 8px",
  borderRadius: "5px",
});

const statusBadge = (blocked) => ({
  background: blocked ? "#e53935" : "#4caf50",
  color: "white",
  padding: "4px 8px",
  borderRadius: "5px",
});

export default UserManagement;