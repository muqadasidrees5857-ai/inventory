import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const AddProductModal = ({
  isOpen,
  onClose,
  onProductAdded,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    supplier: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("price", Number(formData.price));
      data.append("quantity", Number(formData.quantity));
      data.append("supplier", formData.supplier);
      
      if (image) {
        data.append("image", image);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onProductAdded(response.data.product);

      setFormData({
        name: "",
        category: "",
        price: "",
        quantity: "",
        supplier: "",
      });
      setImage(null);

      onClose();
    } catch (error) {
      console.error("Unable to add product:", error);

      setError(
        error.response?.data?.message ||
          "Unable to add product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="product-modal">

        {/* MODAL HEADER */}
        <div className="modal-header">
          <div>
            <h2>Add Product</h2>
            <p>Add a new product to your inventory.</p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            {/* Product Name */}
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                placeholder="Enter category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

            {/* Price */}
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            {/* Quantity */}
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            {/* Supplier */}
            <div className="form-group full-width">
              <label>Supplier</label>
              <input
                type="text"
                name="supplier"
                placeholder="Enter supplier name"
                value={formData.supplier}
                onChange={handleChange}
                required
              />
            </div>

            {/* Product Image */}
            <div className="form-group full-width">
              <label>Product Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

          </div>

          {/* ERROR */}
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AddProductModal;