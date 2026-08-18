
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Package,
} from "lucide-react";

function Cart() {

  const [cart, setCart] = useState([]);

  // =========================
  // Load Cart
  // =========================

  useEffect(() => {

    const savedCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    setCart(savedCart);

  }, []);

  // =========================
  // Save Cart
  // =========================

  const updateCart = (updatedCart) => {

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

  };

  // =========================
  // Increase Quantity
  // =========================

  const increaseQuantity = (id) => {

    const updatedCart = cart.map((item) => {

      if (item.id !== id) {
        return item;
      }

      if (
        item.cartQuantity >=
        item.quantity
      ) {
        return item;
      }

      return {
        ...item,
        cartQuantity:
          item.cartQuantity + 1,
      };

    });

    updateCart(updatedCart);

  };

  // =========================
  // Decrease Quantity
  // =========================

  const decreaseQuantity = (id) => {

    const updatedCart = cart
      .map((item) => {

        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          cartQuantity:
            item.cartQuantity - 1,
        };

      })
      .filter(
        (item) =>
          item.cartQuantity > 0
      );

    updateCart(updatedCart);

  };

  // =========================
  // Remove Product
  // =========================

  const removeProduct = (id) => {

    const updatedCart =
      cart.filter(
        (item) =>
          item.id !== id
      );

    updateCart(updatedCart);

  };

  // =========================
  // Clear Cart
  // =========================

  const clearCart = () => {

    setCart([]);

    localStorage.removeItem(
      "cart"
    );

  };

  // =========================
  // Calculate Total
  // =========================

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        item.cartQuantity,
    0
  );

  // =========================
  // Empty Cart
  // =========================

  if (cart.length === 0) {

    return (

      <div className="cart-page">

        <div className="empty-cart">

          <div className="empty-cart-icon">
            <ShoppingCart size={45} />
          </div>

          <h1>
            Your Cart is Empty
          </h1>

          <p>
            You haven't added any products
            to your cart yet.
          </p>

          <Link
            to="/products"
            className="continue-shopping-btn"
          >

            <ArrowLeft size={18} />

            Continue Shopping

          </Link>

        </div>

      </div>

    );

  }

  // =========================
  // Cart UI
  // =========================

  return (

    <div className="cart-page">

      {/* Header */}

      <div className="cart-header">

        <div>

          <span className="cart-eyebrow">
            SHOPPING CART
          </span>

          <h1>
            Your Cart
          </h1>

          <p>
            Review your selected products
            before checkout.
          </p>

        </div>

        <button
          className="clear-cart-btn"
          onClick={clearCart}
        >
          Clear Cart
        </button>

      </div>

      {/* Cart Layout */}

      <div className="cart-layout">

        {/* Products */}

        <div className="cart-products">

          {cart.map((item) => {

            const imageUrl =
              item.image
                ? item.image.startsWith(
                    "http"
                  )
                  ? item.image
                  : `http://localhost:5001${item.image}`
                : "https://images.unsplash.com/photo-1496181133206-80ce9b88a853";

            return (

              <div
                className="cart-item"
                key={item.id}
              >

                {/* Image */}

                <div className="cart-item-image">

                  <img
                    src={imageUrl}
                    alt={item.name}
                  />

                </div>

                {/* Information */}

                <div className="cart-item-info">

                  <p className="cart-item-category">
                    {item.category}
                  </p>

                  <h3>
                    {item.name}
                  </h3>

                  <p className="cart-item-price">
                    Rs.{" "}
                    {Number(
                      item.price
                    ).toLocaleString()}
                  </p>

                  <div className="cart-quantity">

                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          item.id
                        )
                      }
                    >

                      <Minus size={16} />

                    </button>

                    <span>
                      {item.cartQuantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          item.id
                        )
                      }
                      disabled={
                        item.cartQuantity >=
                        item.quantity
                      }
                    >

                      <Plus size={16} />

                    </button>

                  </div>

                </div>

                {/* Item Total */}

                <div className="cart-item-right">

                  <strong>
                    Rs.{" "}
                    {(
                      Number(item.price) *
                      item.cartQuantity
                    ).toLocaleString()}
                  </strong>

                  <button
                    className="remove-cart-btn"
                    onClick={() =>
                      removeProduct(
                        item.id
                      )
                    }
                  >

                    <Trash2 size={18} />

                  </button>

                </div>

              </div>

            );

          })}

        </div>

        {/* Summary */}

        <div className="cart-summary">

          <h2>
            Order Summary
          </h2>

          <div className="summary-row">

            <span>
              Products
            </span>

            <span>
              {cart.reduce(
                (total, item) =>
                  total +
                  item.cartQuantity,
                0
              )}
            </span>

          </div>

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <span>
              Rs.{" "}
              {subtotal.toLocaleString()}
            </span>

          </div>

          <div className="summary-row">

            <span>
              Delivery
            </span>

            <span>
              Free
            </span>

          </div>

          <hr />

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              Rs.{" "}
              {subtotal.toLocaleString()}
            </strong>

          </div>

         <Link
  to="/checkout"
  className="checkout-btn"
>
  Proceed to Checkout
</Link>

          <Link
            to="/products"
            className="continue-shopping"
          >

            <ArrowLeft size={17} />

            Continue Shopping

          </Link>

        </div>

      </div>

    </div>

  );

}

export default Cart;

