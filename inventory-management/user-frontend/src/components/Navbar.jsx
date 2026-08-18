import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  ShoppingCart,
  User,
  LogOut,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // =========================
  // CHECK LOGGED-IN USER
  // =========================

  useEffect(() => {
    const checkUser = () => {
      try {
        const savedUser = JSON.parse(
          localStorage.getItem("user")
        );

        setUser(savedUser);
      } catch (error) {
        console.error(error);
        setUser(null);
      }
    };

    checkUser();

    window.addEventListener(
      "storage",
      checkUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        checkUser
      );
    };
  }, []);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");
  };

  // =========================
  // CHECK ADMIN
  // =========================

  const isAdmin = user?.role === "admin";

  return (
    <header className="navbar">

      <div className="navbar-container">

        {/* =========================
            LOGO
        ========================= */}

        <Link
          to="/"
          className="navbar-logo"
        >
          Inventory
        </Link>


        {/* =========================
            NAVIGATION
        ========================= */}

        <nav className="navbar-links">

          <NavLink to="/">
            Home
          </NavLink>

          <NavLink to="/products">
            Products
          </NavLink>

          <NavLink to="/categories">
            Categories
          </NavLink>

          <NavLink to="/orders">
            Orders
          </NavLink>

        </nav>


        {/* =========================
            ACTIONS
        ========================= */}

        <div className="navbar-actions">

          {/* Cart */}

          <Link
            to="/cart"
            className="navbar-icon"
          >
            <ShoppingCart size={21} />

            <span>
              Cart
            </span>
          </Link>


          {/* =========================
              NORMAL USER ONLY
          ========================= */}

          {user && !isAdmin && (
            <>

              {/* User Account */}

              <div className="navbar-user">

                <User size={21} />

                <div className="navbar-user-info">

                  <strong>
                    {user.name ||
                      user.email}
                  </strong>

                  <span>
                    Account
                  </span>

                </div>

              </div>


              {/* Logout */}

              <button
                type="button"
                className="navbar-logout-btn"
                onClick={handleLogout}
              >

                <LogOut size={18} />

                <span>
                  Logout
                </span>

              </button>

            </>
          )}


          {/* =========================
              LOGIN
              
              Show when:
              - Nobody logged in
              - Admin is on user frontend
          ========================= */}

          {(!user || isAdmin) && (

            <Link
              to="/login"
              className="navbar-icon"
            >

              <User size={21} />

              <span>
                Login
              </span>

            </Link>

          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;