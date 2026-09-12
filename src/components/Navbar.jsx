import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {

  const { user, logout } = useAuth();

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        CampusMate
      </Link>

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        {user ? (
          <>
            <Link to="/dashboard">
              Dashboard
            </Link>

            <Link to="/profile">
              Profile
            </Link>

            <Link to="/add-resource">
              Add Resource
            </Link>

            <button
              onClick={logout}
              className="logout-button"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/signup">
              Sign up
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;