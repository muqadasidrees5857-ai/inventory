
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


  // =========================================
  // FETCH PRODUCT
  // =========================================

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const response = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/products/${id}`,
);

        const products =
          response.data.products || [];

        const foundProduct =
          products.find(
            (item) =>
              String(item.id) === String(id)
          );

        if (!foundProduct) {

          setError("Product not found.");

          return;

        }

        setProduct(foundProduct);


        // =========================================
        // SET FIRST IMAGE
        // =========================================

        let firstImage = "";


        if (
          foundProduct.images &&
          Array.isArray(foundProduct.images) &&
          foundProduct.images.length > 0
        ) {

          firstImage =
            foundProduct.images[0];

        } else if (foundProduct.image) {

          firstImage =
            foundProduct.image;

        } else {

          firstImage =
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853";

        }


        setSelectedImage(firstImage);


      } catch (error) {

        console.error(error);

        setError(
          "Unable to load product details."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchProduct();

  }, [id]);


  // =========================================
  // IMAGE URL
  // =========================================

  const getImageUrl = (image) => {

    if (!image) {

      return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853";

    }


    if (image.startsWith("http")) {

      return image;

    }


    return `${import.meta.env.VITE_API_URL}${image}`;

  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="product-details-loading">

        <Package size={40} />

        <p>
          Loading product...
        </p>

      </div>

    );

  }


  // =========================================
  // ERROR
  // =========================================

  if (error || !product) {

    return (

      <div className="product-details-error">

        <AlertTriangle size={40} />

        <h2>
          {error || "Product not found."}
        </h2>

        <Link
          to="/products"
          className="back-products-btn"
        >

          Back to Products

        </Link>

      </div>

    );

  }


  // =========================================
  // PRODUCT IMAGES
  // =========================================

  let productImages = [];


  if (
    product.images &&
    Array.isArray(product.images) &&
    product.images.length > 0
  ) {

    productImages =
      product.images;

  } else if (product.image) {

    productImages = [
      product.image,
    ];

  } else {

    productImages = [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    ];

  }


  // =========================================
  // STOCK
  // =========================================

  const outOfStock =
    product.quantity <= 0;


  // =========================================
  // QUANTITY
  // =========================================

  const decreaseQuantity = () => {

    setQuantity((current) =>
      Math.max(
        1,
        current - 1
      )
    );

  };


  const increaseQuantity = () => {

    setQuantity((current) =>
      Math.min(
        product.quantity,
        current + 1
      )
    );

  };


  // =========================================
  // ADD TO CART
  // =========================================

  const handleAddToCart = () => {

    const cartProduct = {

      ...product,

      cartQuantity: quantity,

    };


    const existingCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];


    const existingProduct =
      existingCart.find(
        (item) =>
          item.id === product.id
      );


    let updatedCart;


    if (existingProduct) {

      updatedCart =
        existingCart.map(
          (item) =>

            item.id === product.id

              ? {

                  ...item,

                  cartQuantity:
                    Math.min(
                      product.quantity,

                      item.cartQuantity +
                        quantity
                    ),

                }

              : item
        );

    } else {

      updatedCart = [

        ...existingCart,

        cartProduct,

      ];

    }


    localStorage.setItem(
      "cart",
      JSON.stringify(
        updatedCart
      )
    );


    alert(
      "Product added to cart!"
    );

  };


  // =========================================
  // UI
  // =========================================

  return (

    <div className="product-details-page">


      {/* =========================================
          BACK
      ========================================= */}

      <Link
        to="/products"
        className="back-products"
      >

        <ArrowLeft size={18} />

        Back to Products

      </Link>


      {/* =========================================
          PRODUCT CARD
      ========================================= */}

      <div className="product-details-card">


        {/* =========================================
            IMAGE SECTION
        ========================================= */}

        <div className="product-details-gallery">


          {/* MAIN IMAGE */}

          <div className="product-details-image">

            <img
              src={getImageUrl(
                selectedImage
              )}
              alt={product.name}
            />

          </div>


          {/* THUMBNAILS */}

          {productImages.length > 1 && (

            <div className="product-image-thumbnails">

              {productImages.map(
                (image, index) => (

                  <button
                    key={index}
                    type="button"
                    className={
                      selectedImage === image
                        ? "product-thumbnail active"
                        : "product-thumbnail"
                    }
                    onClick={() =>
                      setSelectedImage(
                        image
                      )
                    }
                  >

                    <img
                      src={getImageUrl(
                        image
                      )}
                      alt={`${product.name} ${index + 1}`}
                    />

                  </button>

                )
              )}

            </div>

          )}

        </div>


        {/* =========================================
            PRODUCT INFORMATION
        ========================================= */}

        <div className="product-details-info">


          {/* Category */}

          <p className="product-details-category">

            {product.category}

          </p>


          {/* Name */}

          <h1>

            {product.name}

          </h1>


          {/* Price */}

          <p className="product-details-price">

            Rs.{" "}

            {Number(
              product.price
            ).toLocaleString()}

          </p>


          {/* Description */}

          <p className="product-details-description">

            High-quality{" "}

            {product.name}

            {" "}available from our inventory.

            Check the available stock and add
            this product to your cart.

          </p>


          {/* Stock */}

          <div className="product-details-stock">

            <Package size={20} />

            {product.quantity > 0 ? (

              <span>

                {product.quantity}
                {" "}units available

              </span>

            ) : (

              <span>

                Out of stock

              </span>

            )}

          </div>


          {/* Supplier */}

          <div className="product-supplier">

            <strong>

              Supplier:

            </strong>

            <span>

              {product.supplier ||
                "Not specified"}

            </span>

          </div>


          {/* Quantity */}

          {!outOfStock && (

            <div className="quantity-section">

              <label>

                Quantity

              </label>


              <div className="quantity-control">


                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  disabled={
                    quantity <= 1
                  }
                >

                  <Minus size={17} />

                </button>


                <span>

                  {quantity}

                </span>


                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                  disabled={
                    quantity >=
                    product.quantity
                  }
                >

                  <Plus size={17} />

                </button>


              </div>

            </div>

          )}


          {/* Add To Cart */}

          <button
            className="add-to-cart-btn"
            onClick={
              handleAddToCart
            }
            disabled={
              outOfStock
            }
          >

            <ShoppingCart size={20} />

            {outOfStock
              ? "Out of Stock"
              : "Add to Cart"}

          </button>


        </div>

      </div>

    </div>

  );

}


export default ProductDetails;
