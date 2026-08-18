
import { Link } from "react-router-dom";

function ProductCard({ product }) {

  const image =
    product.image?.startsWith("http")
      ? product.image
      : product.image
        ? `${import.meta.env.VITE_API_URL}${product.image}`
        : "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="product-card">

      {/* Product Image */}

      <div className="product-image">

        <img
          src={image}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80";
          }}
        />

      </div>

      {/* Product Information */}

      <div className="product-card-body">

        <p className="product-category">
          {product.category}
        </p>

        <h3>
          {product.name}
        </h3>

        <p className="product-price">
          Rs.{" "}
          {Number(product.price).toLocaleString()}
        </p>

        <p className="product-stock">

          {product.quantity > 0
            ? `${product.quantity} available`
            : "Out of stock"}

        </p>

        <Link
          to={`/products/${product.id}`}
          className="product-card-btn"
        >
          View Product
        </Link>

      </div>

    </div>
  );
}

export default ProductCard;
