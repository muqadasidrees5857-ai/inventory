import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Package,
  AlertTriangle,
} from "lucide-react";

function LowStock() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
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

  const lowStockProducts = products.filter(
    (product) => product.quantity <= 10
  );

  const filteredProducts = lowStockProducts.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="stock-page">

      <div className="page-heading">
        <div>
          <p className="eyebrow">INVENTORY</p>
          <h1>Low Stock</h1>
          <p>Products that need restocking.</p>
        </div>
      </div>

      <div className="products-panel">

        <div className="products-toolbar">

          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search low stock products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="product-count">
            {filteredProducts.length} Low Stock
          </div>

        </div>

        {loading ? (
          <div className="empty-state">
            <Package size={35} />
            <p>Loading low stock products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <AlertTriangle size={35} />
            <p>No low stock products found.</p>
          </div>
        ) : (
          <div className="table-wrapper">

            <table className="products-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Supplier</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredProducts.map((product) => (

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
                      <strong>
                        {product.quantity} units
                      </strong>
                    </td>

                    <td>
                      {product.supplier}
                    </td>

                    <td>
  {product.quantity === 0 ? (
    <span className="badge out-of-stock">
      Out of Stock
    </span>
  ) : (
    <span className="badge">
      Low Stock
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

export default LowStock;