import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
} from "lucide-react";

import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Add Product Modal
  const [showModal, setShowModal] = useState(false);

  // Edit Product
  const [editProduct, setEditProduct] = useState(null);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/products"
      );

      setProducts(response.data.products);
    } catch (error) {
      console.error("Unable to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Product
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5001/api/products/${id}`
      );

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.id !== id
        )
      );
    } catch (error) {
      console.error("Unable to delete product:", error);
      alert("Unable to delete product.");
    }
  };

  // Fetch products when page loads
  useEffect(() => {
    fetchProducts();
  }, []);

  // Product Added
  const handleProductAdded = (newProduct) => {
    setProducts((currentProducts) => [
      ...currentProducts,
      newProduct,
    ]);
  };

  // Search
  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="products-page">

      {/* PAGE HEADER */}
      <div className="page-heading">

        <div>
          <p className="eyebrow">INVENTORY</p>

          <h1>Products</h1>

          <p>
            Manage all products in your inventory.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Add Product
        </button>

      </div>

      {/* PRODUCTS PANEL */}
      <div className="products-panel">

        {/* TOOLBAR */}
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

        {/* LOADING */}
        {loading ? (

          <div className="empty-state">

            <Package size={35} />

            <p>
              Loading products...
            </p>

          </div>

        ) : filteredProducts.length === 0 ? (

          /* NO PRODUCTS */
          <div className="empty-state">

            <Package size={35} />

            <p>
              No products found.
            </p>

          </div>

        ) : (

          /* PRODUCTS TABLE */
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

                {filteredProducts.map(
                  (product) => (

                    <tr key={product.id}>

                      {/* PRODUCT */}
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

                      {/* CATEGORY */}
                      <td>

                        <span className="category-badge">
                          {product.category}
                        </span>

                      </td>

                      {/* PRICE */}
                      <td>

                        Rs.{" "}
                        {Number(
                          product.price
                        ).toLocaleString()}

                      </td>

                      {/* QUANTITY */}
                      <td>

                        <strong>
                          {product.quantity}
                        </strong>

                      </td>

                      {/* SUPPLIER */}
                      <td>
                        {product.supplier}
                      </td>

                      {/* ACTIONS */}
                      <td>

                        <div className="action-buttons">

                          {/* EDIT */}
                          <button
                            className="icon-btn edit-btn"
                            title="Edit Product"
                            onClick={() =>
                              setEditProduct(product)
                            }
                          >
                            <Pencil size={17} />
                          </button>

                          {/* DELETE */}
                          <button
                            className="icon-btn delete-btn"
                            title="Delete Product"
                            onClick={() =>
                              handleDelete(product.id)
                            }
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ADD PRODUCT MODAL */}
      {showModal && (
        <AddProductModal
          onClose={() =>
            setShowModal(false)
          }
          onProductAdded={
            handleProductAdded
          }
        />
      )}

      {/* EDIT PRODUCT MODAL */}
      {editProduct && (
        <EditProductModal
          product={editProduct}

          onClose={() =>
            setEditProduct(null)
          }

          onProductUpdated={(
            updatedProduct
          ) => {

            setProducts(
              (currentProducts) =>
                currentProducts.map(
                  (product) =>
                    product.id ===
                    updatedProduct.id
                      ? updatedProduct
                      : product
                )
            );

            setEditProduct(null);
          }}
        />
      )}

    </div>
  );
}

export default Products;