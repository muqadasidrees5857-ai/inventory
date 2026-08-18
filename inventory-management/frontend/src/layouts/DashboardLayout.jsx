
import Footer from "./Footer";
import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Boxes,
  AlertTriangle,
  ShoppingCart,
  LogOut,
} from "lucide-react";

function DashboardLayout() {

  const handleLogout = () => {
    localStorage.removeItem("user");

    // Admin panel se user interface ke login page par
    window.location.href = "http://localhost:5173/login";
  };

  return (
    <div className="dashboard-layout">

      <aside className="sidebar">

        <div className="sidebar-logo">
          <h2>Inventory</h2>
        </div>

        <nav className="sidebar-nav">

          <NavLink to="/">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/products">
            <Package size={18} />
            <span>Products</span>
          </NavLink>

          <NavLink to="/stock">
            <Boxes size={18} />
            <span>Stock</span>
          </NavLink>

          <NavLink to="/low-stock">
            <AlertTriangle size={18} />
            <span>Low Stock</span>
          </NavLink>

          <NavLink to="/orders">
            <ShoppingCart size={18} />
            <span>Orders</span>
          </NavLink>

        </nav>

        {/* Logout */}

        <button
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </aside>

      <div className="main-area">

        <header className="topbar">
          <h3>Inventory Management</h3>
        </header>

        <main className="content">
          <Outlet />
        </main>

        <Footer />

      </div>

    </div>
  );
}

export default DashboardLayout;
