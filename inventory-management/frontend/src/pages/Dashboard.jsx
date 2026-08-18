import { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  Boxes,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
       `${import.meta.env.VITE_API_URL}/api/products/${product.id}`,
      );

      setProducts(response.data.products);
    } catch (error) {
      console.error("Unable to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const lowStock = products.filter(
    (product) => product.quantity <= 10
  ).length;

  const totalValue = products.reduce(
    (total, product) =>
      total + product.price * product.quantity,
    0
  );

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="empty-state">
          <Package size={35} />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Dashboard</h1>
          <p>
            Welcome to your inventory management dashboard.
          </p>
        </div>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">
            <Package size={22} />
          </div>

          <div>
            <p>Total Products</p>
            <h2>{totalProducts}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Boxes size={22} />
          </div>

          <div>
            <p>Total Stock</p>
            <h2>{totalStock}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <AlertTriangle size={22} />
          </div>

          <div>
            <p>Low Stock</p>
            <h2>{lowStock}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={22} />
          </div>

          <div>
            <p>Inventory Value</p>
            <h2>
              Rs. {totalValue.toLocaleString()}
            </h2>
          </div>
        </div>

      </div>

      <div className="products-panel">

        <div className="products-toolbar">
          <div>
            <h2>Recent Products</h2>
            <p>Latest products in your inventory.</p>
          </div>

          <div className="product-count">
            {products.length} Products
          </div>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <Package size={35} />
            <p>No products available.</p>
          </div>
        ) : (
          <div className="table-wrapper">

            <table className="products-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {products.slice(-5).reverse().map((product) => (

                  <tr key={product.id}>

                    <td>
                      <div className="product-table-name">

                        <div className="product-avatar">
                          {product.name
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>

                        <strong>
                          {product.name}
                        </strong>

                      </div>
                    </td>

                    <td>
                      <span className="category-badge">
                        {product.category}
                      </span>
                    </td>

                    <td>
                      Rs. {product.price.toLocaleString()}
                    </td>

                    <td>
                      <strong>
                        {product.quantity}
                      </strong>
                    </td>

                    <td>
                      {product.quantity <= 10 ? (
                        <span className="badge">
                          Low Stock
                        </span>
                      ) : (
                        <span className="category-badge">
                          In Stock
                        </span>
                      )}
                    </td>

                  </tr>

                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;