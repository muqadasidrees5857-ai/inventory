
import { useState } from "react";
import { X, Plus, Image, Trash2 } from "lucide-react";
import axios from "axios";

function AddProductModal({ onClose, onProductAdded }) {

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    supplier: "",
  });

  // Multiple images
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // Handle Text Inputs
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Handle Multiple Images
  // =========================

  const handleImageChange = (e) => {

    const selectedFiles = Array.from(
      e.target.files
    );

    if (!selectedFiles.length) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    // Maximum 6 images
    if (images.length + selectedFiles.length > 6) {
      setError("You can upload maximum 6 images.");
      return;
    }

    for (const file of selectedFiles) {

      // 5MB per image
      if (file.size > 5 * 1024 * 1024) {
        setError(
          `${file.name} is larger than 5MB.`
        );
        return;
      }

      // Image type
      if (!allowedTypes.includes(file.type)) {
        setError(
          "Only JPG, JPEG, PNG and WEBP images are allowed."
        );
        return;
      }
    }

    setError("");

    setImages((previousImages) => [
      ...previousImages,
      ...selectedFiles,
    ]);

    // Allow selecting the same file again
    e.target.value = "";
  };

  // =========================
  // Remove Image
  // =========================

  const removeImage = (indexToRemove) => {

    setImages((previousImages) =>
      previousImages.filter(
        (_, index) =>
          index !== indexToRemove
      )
    );
  };

  // =========================
  // Submit Product
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const data = new FormData();

      data.append(
        "name",
        formData.name
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "price",
        Number(formData.price)
      );

      data.append(
        "quantity",
        Number(formData.quantity)
      );

      data.append(
        "supplier",
        formData.supplier
      );

      // =========================
      // Add Multiple Images
      // =========================

      images.forEach((image) => {
        data.append("images", image);
      });

      const response =
        await axios.post(
          "http://localhost:5001/api/products",
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      onProductAdded(
        response.data.product
      );

      onClose();

    } catch (error) {

      console.error(error);

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

        {/* =========================
            Header
        ========================= */}

        <div className="modal-header">

          <div>

            <h2>
              Add Product
            </h2>

            <p>
              Add a new product to your inventory.
            </p>

          </div>

          <button
            className="modal-close"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>

        </div>

        {/* =========================
            Form
        ========================= */}

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* Product Name */}

            <div className="form-group">

              <label>
                Product Name
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Mouse"
                required
              />

            </div>

            {/* Category */}

            <div className="form-group">

              <label>
                Category
              </label>

              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Electronics"
                required
              />

            </div>

            {/* Price */}

            <div className="form-group">

              <label>
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 1500"
                min="0"
                required
              />

            </div>

            {/* Quantity */}

            <div className="form-group">

              <label>
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. 25"
                min="0"
                required
              />

            </div>

            {/* Supplier */}

            <div className="form-group full-width">

              <label>
                Supplier
              </label>

              <input
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                placeholder="e.g. ABC Electronics"
                required
              />

            </div>

            {/* =========================
                Multiple Images
            ========================= */}

            <div className="form-group full-width">

              <label>
                Product Images
              </label>

              <div className="image-upload-box">

                <Image size={22} />

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  multiple
                  onChange={handleImageChange}
                />

              </div>

              <small>
                Select up to 6 images.
                JPG, PNG or WEBP — maximum 5MB per image.
              </small>

              {/* Image Preview */}

              {images.length > 0 && (

                <div className="selected-images">

                  {images.map((image, index) => (

                    <div
                      className="selected-image-item"
                      key={`${image.name}-${index}`}
                    >

                      <img
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                      />

                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() =>
                          removeImage(index)
                        }
                      >
                        <Trash2 size={15} />
                      </button>

                      <span>
                        {index + 1}
                      </span>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

          {/* Error */}

          {error && (

            <div className="form-error">
              {error}
            </div>

          )}

          {/* Actions */}

          <div className="modal-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >

              <Plus size={18} />

              {loading
                ? "Adding..."
                : "Add Product"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddProductModal;