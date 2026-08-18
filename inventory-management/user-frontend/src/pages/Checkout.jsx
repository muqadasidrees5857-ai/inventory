import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";

function Checkout() {
  const navigate = useNavigate();

  const cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  // =========================
  // Customer Form
  // =========================

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  // =========================
  // Payment
  // =========================

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  const [paymentDetails, setPaymentDetails] =
    useState({
      accountNumber: "",
      transactionId: "",
      bankName: "",
      accountTitle: "",
    });

  // =========================
  // Other States
  // =========================

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // Calculate Total
  // =========================

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.cartQuantity),
    0
  );

  const delivery = 0;

  const total = subtotal + delivery;

  // =========================
  // Customer Input
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Payment Input
  // =========================

  const handlePaymentDetailsChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Payment Method
  // =========================

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);

    setPaymentDetails({
      accountNumber: "",
      transactionId: "",
      bankName: "",
      accountTitle: "",
    });

    setError("");
  };

  // =========================
  // Place Order
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // =========================
    // Cart Validation
    // =========================

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    // =========================
    // Payment Validation
    // =========================

    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    // =========================
    // JazzCash Validation
    // =========================

    if (paymentMethod === "JazzCash") {
      if (
        !paymentDetails.accountNumber ||
        !paymentDetails.transactionId
      ) {
        setError(
          "JazzCash account number and transaction ID are required."
        );
        return;
      }
    }

    // =========================
    // Bank Transfer Validation
    // =========================

    if (paymentMethod === "Bank Transfer") {
      if (
        !paymentDetails.bankName ||
        !paymentDetails.accountTitle ||
        !paymentDetails.transactionId
      ) {
        setError(
          "Bank name, account title and transaction ID are required."
        );
        return;
      }
    }

    try {
      setLoading(true);

      // =========================
      // Get Logged In User
      // =========================

      const loggedInUser =
        JSON.parse(
          localStorage.getItem("user")
        ) || null;

      // =========================
      // Send Order To Backend
      // =========================

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/${product.id}`,
        {
          customer: formData,

          items: cart,

          subtotal,

          delivery,

          total,

          paymentMethod,

          paymentDetails:
            paymentMethod === "COD"
              ? {}
              : paymentDetails,

          // Send user information
          userId:
            loggedInUser?.id || null,

          userEmail:
            loggedInUser?.email || null,
        }
      );

      // =========================
      // Success
      // =========================

      if (response.data.success) {
        localStorage.removeItem("cart");

        alert(
          "Order placed successfully!"
        );

        navigate("/orders");
      } else {
        setError(
          response.data.message ||
            "Unable to place order."
        );
      }
    } catch (error) {
      console.error(
        "Order Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Empty Cart
  // =========================

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">

        <ShoppingBag size={50} />

        <h1>
          Your Cart is Empty
        </h1>

        <p>
          Add some products before
          proceeding to checkout.
        </p>

        <Link
          to="/products"
          className="continue-shopping-btn"
        >
          Browse Products
        </Link>

      </div>
    );
  }

  // =========================
  // Checkout Page
  // =========================

  return (
    <div className="checkout-page">

      {/* Header */}

      <div className="checkout-header">

        <Link
          to="/cart"
          className="back-checkout"
        >
          <ArrowLeft size={18} />

          Back to Cart
        </Link>

        <div>

          <span className="checkout-eyebrow">
            CHECKOUT
          </span>

          <h1>
            Complete Your Order
          </h1>

          <p>
            Enter your delivery information
            to place your order.
          </p>

        </div>

      </div>

      <div className="checkout-layout">

        {/* =========================
            CUSTOMER FORM
        ========================= */}

        <div className="checkout-form-card">

          <h2>
            Delivery Information
          </h2>

          <form onSubmit={handleSubmit}>

            {/* Name */}

            <div className="checkout-form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

            </div>

            {/* Phone */}

            <div className="checkout-form-group">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="03XX-XXXXXXX"
                required
              />

            </div>

            {/* Address */}

            <div className="checkout-form-group">

              <label>
                Complete Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete delivery address"
                rows="4"
                required
              />

            </div>

            {/* City */}

            <div className="checkout-form-group">

              <label>
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
                required
              />

            </div>

            {/* =========================
                PAYMENT METHOD
            ========================= */}

            <div className="checkout-payment-section">

              <h2>
                Payment Method
              </h2>

              <p className="payment-method-description">
                Select how you want to pay for your order.
              </p>

              <div className="payment-method-options">

                {/* COD */}

                <label
                  className={`payment-method-option ${
                    paymentMethod === "COD"
                      ? "active"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={
                      paymentMethod === "COD"
                    }
                    onChange={
                      handlePaymentMethodChange
                    }
                  />

                  <div className="payment-method-content">

                    <strong>
                      Cash on Delivery
                    </strong>

                    <span>
                      Pay when your order arrives.
                    </span>

                  </div>

                </label>

                {/* JazzCash */}

                <label
                  className={`payment-method-option ${
                    paymentMethod === "JazzCash"
                      ? "active"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="JazzCash"
                    checked={
                      paymentMethod === "JazzCash"
                    }
                    onChange={
                      handlePaymentMethodChange
                    }
                  />

                  <div className="payment-method-content">

                    <strong>
                      JazzCash
                    </strong>

                    <span>
                      Pay using your JazzCash account.
                    </span>

                  </div>

                </label>

                {/* Bank Transfer */}

                <label
                  className={`payment-method-option ${
                    paymentMethod ===
                    "Bank Transfer"
                      ? "active"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Bank Transfer"
                    checked={
                      paymentMethod ===
                      "Bank Transfer"
                    }
                    onChange={
                      handlePaymentMethodChange
                    }
                  />

                  <div className="payment-method-content">

                    <strong>
                      Bank Transfer
                    </strong>

                    <span>
                      Pay through bank / ATM transfer.
                    </span>

                  </div>

                </label>

              </div>

              {/* =========================
                  JAZZCASH DETAILS
              ========================= */}

              {paymentMethod === "JazzCash" && (

                <div className="payment-details">

                  <h3>
                    JazzCash Payment Details
                  </h3>

                  <div className="checkout-form-group">

                    <label>
                      JazzCash Account Number
                    </label>

                    <input
                      type="tel"
                      name="accountNumber"
                      value={
                        paymentDetails.accountNumber
                      }
                      onChange={
                        handlePaymentDetailsChange
                      }
                      placeholder="03XX-XXXXXXX"
                      required
                    />

                  </div>

                  <div className="checkout-form-group">

                    <label>
                      Transaction ID
                    </label>

                    <input
                      type="text"
                      name="transactionId"
                      value={
                        paymentDetails.transactionId
                      }
                      onChange={
                        handlePaymentDetailsChange
                      }
                      placeholder="Enter transaction ID"
                      required
                    />

                  </div>

                </div>

              )}

              {/* =========================
                  BANK TRANSFER DETAILS
              ========================= */}

              {paymentMethod ===
                "Bank Transfer" && (

                <div className="payment-details">

                  <h3>
                    Bank Transfer Details
                  </h3>

                  <div className="checkout-form-group">

                    <label>
                      Bank Name
                    </label>

                    <input
                      type="text"
                      name="bankName"
                      value={
                        paymentDetails.bankName
                      }
                      onChange={
                        handlePaymentDetailsChange
                      }
                      placeholder="Enter bank name"
                      required
                    />

                  </div>

                  <div className="checkout-form-group">

                    <label>
                      Account Title
                    </label>

                    <input
                      type="text"
                      name="accountTitle"
                      value={
                        paymentDetails.accountTitle
                      }
                      onChange={
                        handlePaymentDetailsChange
                      }
                      placeholder="Enter account title"
                      required
                    />

                  </div>

                  <div className="checkout-form-group">

                    <label>
                      Transaction ID
                    </label>

                    <input
                      type="text"
                      name="transactionId"
                      value={
                        paymentDetails.transactionId
                      }
                      onChange={
                        handlePaymentDetailsChange
                      }
                      placeholder="Enter transaction ID"
                      required
                    />

                  </div>

                </div>

              )}

            </div>

            {/* Error */}

            {error && (
              <div className="checkout-error">
                {error}
              </div>
            )}

            {/* Place Order */}

            <button
              type="submit"
              className="place-order-btn"
              disabled={loading}
            >
              {loading
                ? "Placing Order..."
                : "Place Order"}
            </button>

          </form>

        </div>

        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <div className="checkout-summary">

          <h2>
            Order Summary
          </h2>

          <div className="checkout-items">

            {cart.map((item) => {

              const imageUrl = item.image
                ? item.image.startsWith("http")
                  ? item.image
                  : `${import.meta.env.VITE_API_URL}${item.image}`
                : "https://images.unsplash.com/photo-1496181133206-80ce9b88a853";

              return (
                <div
                  className="checkout-item"
                  key={item.id}
                >

                  <div className="checkout-item-image">

                    <img
                      src={imageUrl}
                      alt={item.name}
                    />

                  </div>

                  <div className="checkout-item-info">

                    <h4>
                      {item.name}
                    </h4>

                    <p>
                      Qty: {item.cartQuantity}
                    </p>

                    <strong>
                      Rs.{" "}
                      {(
                        Number(item.price) *
                        Number(item.cartQuantity)
                      ).toLocaleString()}
                    </strong>

                  </div>

                </div>
              );
            })}

          </div>

          {/* Subtotal */}

          <div className="checkout-total-row">

            <span>
              Subtotal
            </span>

            <span>
              Rs.{" "}
              {subtotal.toLocaleString()}
            </span>

          </div>

          {/* Delivery */}

          <div className="checkout-total-row">

            <span>
              Delivery
            </span>

            <span>
              Free
            </span>

          </div>

          <hr />

          {/* Total */}

          <div className="checkout-grand-total">

            <span>
              Total
            </span>

            <strong>
              Rs.{" "}
              {total.toLocaleString()}
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;