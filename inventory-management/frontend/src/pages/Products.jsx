import React, { useEffect, useState } from "react";
import axios from "axios";
import AddProductModal from "../components/AddProductModal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`
      );

      setProducts(response.data.products || response.data);
    } catch (error) {
      console.error("Unable to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`
      );

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error("Unable to delete product:", error);
      alert("Unable to delete product.");
    }
  };

  const handleProductAdded = (newProduct) => {
    setProducts((currentProducts) => [
      ...currentProducts,
      newProduct,
    ]);
  };

  return (
    <div className="products-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-heading">

        <div>
          <p className="eyebrow">INVENTORY</p>

          <h1>Products</h1>

          <p>
            Manage your inventory products.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Product
        </button>

      </div>


      {/* =========================
          PRODUCTS PANEL
      ========================= */}

      {loading ? (

        <div className="products-panel">

          <div className="empty-state">
            <p>Loading products...</p>
          </div>

        </div>

      ) : (

        <div className="products-panel">

          <div className="products-toolbar">

            <div className="product-count">
              {products.length}{" "}
              {products.length === 1
                ? "Product"
                : "Products"}
            </div>

          </div>


          {/* =========================
              PRODUCTS TABLE
          ========================= */}

          {products.length === 0 ? (

            <div className="empty-state">
              <p>No products found.</p>
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
                    <th>Supplier</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {products.map((product) => (

                    <tr key={product.id}>

                      <td>
                        <div className="product-table-name">

                          <div className="product-avatar">
                            {product.name
                              ? product.name
                                  .charAt(0)
                                  .toUpperCase()
                              : "P"}
                          </div>

                          <strong>
                            {product.name}
                          </strong>

                        </div>
                      </td>

                      <td>
                        <span className="category-badge">
                          {product.category || "N/A"}
                        </span>
                      </td>

                      <td>
                        Rs.{" "}
                        {Number(
                          product.price
                        ).toLocaleString()}
                      </td>

                      <td>
                        {product.quantity ?? 0}
                      </td>

                      <td>
                        {product.supplier || "N/A"}
                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="icon-btn delete-btn"
                            onClick={() =>
                              handleDelete(product.id)
                            }
                            title="Delete product"
                          >
                            Delete
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

      )}


      {/* =========================
          ADD PRODUCT MODAL
      ========================= */}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={handleProductAdded}
      />

    </div>
  );
};

export default Products;