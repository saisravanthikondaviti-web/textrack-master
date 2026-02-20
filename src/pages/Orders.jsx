import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

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
    <div className="container">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="card" style={{ marginBottom: "20px" }}>
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p><strong>Status:</strong> {order.status}</p>

            <h4>Items:</h4>
            {order.items.map(item => (
              <p key={item.id}>
                {item.name} × {item.quantity}
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;