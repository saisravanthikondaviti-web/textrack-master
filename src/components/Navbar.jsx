import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <h2>TexTrack</h2>

      <div>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Orders</Link>

        {user ? (
          <>
            <span style={{ marginRight: "10px" }}>{user.email}</span>
            <button className="btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;