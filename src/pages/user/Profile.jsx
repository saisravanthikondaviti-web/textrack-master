import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../services/firebase";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!currentUser) return;

    const snap = await getDoc(
      doc(db, "users", currentUser.uid)
    );

    if (snap.exists()) {
      setUserData(snap.data());
      setForm({
        name: snap.data().name || "",
        phone: snap.data().phone || "",
      });
    }
  };

  const handleUpdate = async () => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      name: form.name,
      phone: form.phone,
    });

    setEditing(false);
    fetchUserData();
  };

  if (!userData) return <p>Loading profile...</p>;

  return (
    <div style={container}>
      <h2>👤 My Profile</h2>

      <div style={card}>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>

        <p>
          <strong>Role:</strong> {userData.role}
        </p>

        <p>
          <strong>Account Created:</strong>{" "}
          {userData.createdAt?.toDate().toLocaleDateString()}
        </p>

        <hr />

        {editing ? (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              style={input}
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              style={input}
            />

            <button style={saveBtn} onClick={handleUpdate}>
              Save Changes
            </button>
          </>
        ) : (
          <>
            <p>
              <strong>Name:</strong>{" "}
              {userData.name || "Not Added"}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {userData.phone || "Not Added"}
            </p>

            <button
              style={editBtn}
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ---------- Styles ---------- */

const container = {
  padding: "20px",
  display: "flex",
  justifyContent: "center",
};

const card = {
  width: "400px",
  background: "#ffffff",
  padding: "25px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const input = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
};

const editBtn = {
  background: "#2196f3",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "5px",
  cursor: "pointer",
};

const saveBtn = {
  background: "#4caf50",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Profile;