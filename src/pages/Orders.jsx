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

  const statusSteps = ["pending", "packed", "shipped", "delivered"];

  const getStepIndex = (status) =>
    statusSteps.findIndex(s => s === status?.toLowerCase());

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <div className="empty-icon">📦</div>
          <h3>No Orders Yet</h3>
          <p>Looks like you haven’t placed any orders.</p>
          <button className="shop-btn" onClick={() => window.location.href="/products"}>
            Start Shopping
          </button>
        </div>
      ) : (
        orders.map(order => {
          const currentStep = getStepIndex(order.status);

          return (
            <div key={order.id} className="order-card">

              <div className="order-header">
                <div>
                  <p className="order-id">Order ID: {order.id}</p>
                  <p className="order-total">₹{order.total}</p>
                </div>
                <span className={`status-badge ${order.status}`}>
                  {order.status}
                </span>
              </div>

              {/* PROGRESS BAR */}
              <div className="progress-bar">
                {statusSteps.map((step, index) => (
                  <div key={step} className="progress-step">
                    <div className={`step-circle ${index <= currentStep ? "active" : ""}`}>
                      {index + 1}
                    </div>
                    <span className="step-label">{step}</span>
                    {index < statusSteps.length - 1 && (
                      <div className={`step-line ${index < currentStep ? "active" : ""}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* ITEMS */}
              <div className="order-items">
                {order.items.map(item => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p className="item-name">{item.name}</p>
                      <p className="item-qty">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          );
        })
      )}
    </div>
  );
}

export default Orders;