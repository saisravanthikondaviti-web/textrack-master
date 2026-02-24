import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import "../styles/orders.css";

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(data);
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>No orders yet</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">

            <div className="order-row">
              <span>Order ID</span>
              <span>{order.id}</span>
            </div>

            <div className="order-row">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>

            <div className="order-row">
              <span>Status</span>
              <span className={`status ${order.status}`}>
                {order.status}
              </span>
            </div>

            <div className="order-items">
              <strong>Items</strong>
              {order.items.map(item => (
                <div key={item.id} className="order-row">
                  <span>{item.name}</span>
                  <span>× {item.quantity}</span>
                </div>
              ))}
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default Orders;