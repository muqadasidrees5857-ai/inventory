import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  AlertTriangle,
  Plus,
  Minus,
} from "lucide-react";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  // FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        
        // Single product object retrieve kar rahe hain
        const foundProduct = response.data.product || response.data;

        if (!foundProduct || (!foundProduct.id && !foundProduct._id)) {
          setError("Product not found.");
          return;
        }

        setProduct(foundProduct);

        // First image setup
        let firstImage = "";
        if (
          foundProduct.images &&
          Array.isArray(foundProduct.images) &&
          foundProduct.images.length > 0
        ) {
          firstImage = foundProduct.images[0];
        } else if (foundProduct.image) {
          firstImage = foundProduct.image;
        } else {
          firstImage = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853";
        }

        setSelectedImage(firstImage);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Unable to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, API_URL]);

  // IMAGE URL HANDLER
  const getImageUrl = (image) => {
    if (!image) {
      return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853";
    }
    if (image.startsWith("http")) {
      return image;
    }
    return `${API_URL}${image}`;
  };

  if (loading) {
    return (
      <div className="product-details-loading">
        <Package size={40} />
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-error">
        <AlertTriangle size={40} />
        <h2>{error || "Product not found."}</h2>
        <Link to="/products" className="back-products-btn">
          Back to Products
        </Link>
      </div>
    );
  }

  let productImages = [];
  if (
    product.images &&
    Array.isArray(product.images) &&
    product.images.length > 0
  ) {
    productImages = product.images;
  } else if (product.image) {
    productImages = [product.image];
  } else {
    productImages = ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853"];
  }

  const outOfStock = product.quantity <= 0;

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    setQuantity((current) => Math.min(product.quantity, current + 1));
  };

  const handleAddToCart = () => {
    const cartProduct = {
      ...product,
      cartQuantity: quantity,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const pId = product.id || product._id;
    const existingProduct = existingCart.find((item) => (item.id || item._id) === pId);

    let updatedCart;
    if (existingProduct) {
      updatedCart = existingCart.map((item) =>
        (item.id || item._id) === pId
          ? {
              ...item,
              cartQuantity: Math.min(
                product.quantity,
                item.cartQuantity + quantity
              ),
            }
          : item
      );
    } else {
      updatedCart = [...existingCart, cartProduct];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("Product added to cart!");
  };

  return (
    <div className="product-details-page">
      <Link to="/products" className="back-products">
        <ArrowLeft size={18} />
        Back to Products
      </Link>

      <div className="product-details-card">
        <div className="product-details-gallery">
          <div className="product-details-image">
            <img src={getImageUrl(selectedImage)} alt={product.name} />
          </div>

          {productImages.length > 1 && (
            <div className="product-image-thumbnails">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    selectedImage === image
                      ? "product-thumbnail active"
                      : "product-thumbnail"
                  }
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`${product.name} ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-details-info">
          <p className="product-details-category">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="product-details-price">
            Rs. {Number(product.price || 0).toLocaleString()}
          </p>

          <p className="product-details-description">
            High-quality {product.name} available from our inventory.
          </p>

          <div className="product-details-stock">
            <Package size={20} />
            {product.quantity > 0 ? (
              <span>{product.quantity} units available</span>
            ) : (
              <span>Out of stock</span>
            )}
          </div>

          <div className="product-supplier">
            <strong>Supplier: </strong>
            <span>{product.supplier || "Not specified"}</span>
          </div>

          {!outOfStock && (
            <div className="quantity-section">
              <label>Quantity</label>
              <div className="quantity-control">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus size={17} />
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.quantity}
                >
                  <Plus size={17} />
                </button>
              </div>
            </div>
          )}

          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            <ShoppingCart size={20} />
            {outOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;