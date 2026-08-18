import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Package,
  Plus,
  Minus,
} from "lucide-react";

function Stock() {
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

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ADD STOCK
  const handleAddStock = async (product) => {
    const newQuantity = product.quantity + 1;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/products/${product.id}`,
        {
          name: product.name,
          category: product.category,
          price: product.price,
          quantity: newQuantity,
          supplier: product.supplier,
        }
      );

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === product.id
            ? response.data.product
            : item
        )
      );
    } catch (error) {
      console.error("Unable to add stock:", error);
      alert("Unable to add stock.");
    }
  };

  // REMOVE STOCK
  const handleRemoveStock = async (product) => {
    if (product.quantity <= 0) {
      alert("Stock cannot be less than 0.");
      return;
    }

    const newQuantity = product.quantity - 1;

    try {
      const response = await axios.put(
       `${import.meta.env.VITE_API_URL}/api/products/${product.id}`,
        {
          name: product.name,
          category: product.category,
          price: product.price,
          quantity: newQuantity,
          supplier: product.supplier,
        }
      );

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === product.id
            ? response.data.product
            : item
        )
      );
    } catch (error) {
      console.error("Unable to remove stock:", error);
      alert("Unable to remove stock.");
    }
  };

  return (
    <div className="stock-page">

      <div className="page-heading">
        <div>
          <p className="eyebrow">INVENTORY</p>
          <h1>Stock</h1>
          <p>Manage product stock levels.</p>
        </div>
      </div>

      <div className="products-panel">

        <div className="products-toolbar">

          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="product-count">
            {filteredProducts.length} Products
          </div>

        </div>

        {loading ? (
          <div className="empty-state">
            <Package size={35} />
            <p>Loading stock...</p>
          </div>
        ) : (
          <div className="table-wrapper">

            <table className="products-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Status</th>
                  <th>Stock Action</th>
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

                    <td>
                      <div className="action-buttons">

                        <button
                          className="icon-btn edit-btn"
                          title="Add Stock"
                          onClick={() =>
                            handleAddStock(product)
                          }
                        >
                          <Plus size={17} />
                        </button>

                        <button
                          className="icon-btn delete-btn"
                          title="Remove Stock"
                          onClick={() =>
                            handleRemoveStock(product)
                          }
                        >
                          <Minus size={17} />
                        </button>

                      </div>
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

export default Stock;