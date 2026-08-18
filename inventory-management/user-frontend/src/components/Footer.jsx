
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>Inventory</h2>
          <p>
            Your trusted place for quality products at affordable prices.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/orders">Orders</a>
          <a href="/cart">Cart</a>
        </div>

        <div className="footer-links">
          <h3>Account</h3>

          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Inventory Management System. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

