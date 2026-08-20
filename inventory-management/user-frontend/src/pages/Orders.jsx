import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  Package,
  ShoppingBag,
  ArrowLeft,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // API URL
  // =====================================================

  const API_URL = `${import.meta.env.VITE_API_URL}/api/orders`;

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      // Removed Cache-Control headers to prevent CORS errors
      const response = await axios.get(API_URL, {
        params: {
          _t: Date.now(),
        },
      });

      console.log("Orders API Response:", response.data);

      if (!response.data.success) {
        setOrders([]);
        return;
      }

      const latestOrders = response.data.orders || [];

      // =================================================
      // NORMALIZE ORDERS
      // =================================================

      const normalizedOrders = latestOrders.map((order) => ({
        ...order,

        status:
          order.status ||
          order.order_status ||
          "Pending",

        createdAt:
          order.createdAt ||
          order.created_at ||
          null,

        total:
          order.total ||
          order.total_amount ||
          0,

        delivery:
          order.delivery !== undefined
            ? order.delivery
            : order.delivery_fee !== undefined
            ? order.delivery_fee
            : 0,
      }));

      setOrders(normalizedOrders);

      console.log(
        "Orders shown on frontend:",
        normalizedOrders
      );
    } catch (err) {
      console.error(
        "Unable to fetch orders:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load orders. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [API_URL]);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchOrders(true);
  }, [fetchOrders]);

  // =====================================================
  // AUTO REFRESH (EVERY 10 SECONDS)
  // =====================================================

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Auto refreshing orders...");
      fetchOrders(false);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchOrders]);

  // =====================================================
  // REFRESH WHEN USER RETURNS TO TAB
  // =====================================================

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("User returned to Orders page.");
        fetchOrders(false);
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [fetchOrders]);

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock size={16} />;

      case "Processing":
        return <RefreshCw size={16} />;

      case "Shipped":
        return <Truck size={16} />;

      case "Delivered":
        return <CheckCircle size={16} />;

      case "Cancelled":
        return <XCircle size={16} />;

      default:
        return <Clock size={16} />;
    }
  };

  // =====================================================
  // EMPTY ORDERS
  // =====================================================

  if (!loading && !error && orders.length === 0) {
    return (
      <div className="orders-empty">
        <div className="orders-empty-icon">
          <ShoppingBag size={45} />
        </div>

        <h1>No Orders Yet</h1>

        <p>You haven't placed any orders yet.</p>

        <Link to="/products" className="continue-shopping-btn">
          <ArrowLeft size={18} />
          Start Shopping
        </Link>
      </div>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="orders-empty">
        <div className="orders-empty-icon">
          <Package size={45} />
        </div>

        <h1>Loading Orders...</h1>

        <p>Please wait while we load your orders.</p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="orders-empty">
        <div className="orders-empty-icon error-icon">
          <XCircle size={45} />
        </div>

        <h1>Unable to Load Orders</h1>

        <p>{error}</p>

        <button
          className="continue-shopping-btn"
          onClick={() => fetchOrders(true)}
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      </div>
    );
  }

  // =====================================================
  // ORDERS PAGE
  // =====================================================

  return (
    <div className="orders-page">
      {/* HEADER */}
      <div className="orders-header">
        <div>
          <span className="orders-eyebrow">ORDER HISTORY</span>
          <h1>My Orders</h1>
          <p>View your previous orders and order details.</p>
        </div>

        <div className="orders-header-actions">
          <button
            className="orders-refresh-btn"
            onClick={() => fetchOrders(false)}
            disabled={refreshing}
            title="Refresh Orders"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "refresh-spinning" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <Link to="/products" className="orders-shop-btn">
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="orders-list">
        {orders.map((order) => {
          const currentStatus =
            order.status || order.order_status || "Pending";

          const statusClass = currentStatus
            .toLowerCase()
            .replace(/\s+/g, "-");

          return (
            <div className="order-card" key={order.id}>
              {/* ORDER HEADER */}
              <div className="order-card-header">
                <div>
                  <span className="order-label">ORDER ID</span>
                  <h3>#{order.id}</h3>
                </div>

                <div className={`order-status status-${statusClass}`}>
                  {getStatusIcon(currentStatus)}
                  <span>{currentStatus}</span>
                </div>
              </div>

              {/* ORDER DATE */}
              <div className="order-date">
                <Package size={17} />
                <span>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString(
                        "en-PK",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "Date not available"}
                </span>
              </div>

              {/* PRODUCTS */}
              <div className="order-products">
                {order.items?.map((item, index) => {
                  const imageUrl = item.image
                    ? item.image.startsWith("http")
                      ? item.image
                      : `${import.meta.env.VITE_API_URL}${item.image}`
                    : "https://images.unsplash.com/photo-1496181133206-80ce9b88a853";

                  return (
                    <div
                      className="order-product"
                      key={`${item.id}-${index}`}
                    >
                      <div className="order-product-image">
                        <img
                          src={imageUrl}
                          alt={item.name || "Product"}
                        />
                      </div>

                      <div className="order-product-info">
                        <h4>{item.name}</h4>
                        <p>{item.category || "Product"}</p>
                        <span>
                          Quantity:{" "}
                          {item.cartQuantity || item.quantity || 1}
                        </span>
                      </div>

                      <strong>
                        Rs.{" "}
                        {(
                          Number(item.price || 0) *
                          Number(item.cartQuantity || item.quantity || 1)
                        ).toLocaleString()}
                      </strong>
                    </div>
                  );
                })}
              </div>

              {/* ORDER FOOTER */}
              <div className="order-footer">
                <div>
                  <span>Total Amount</span>
                  <strong>
                    Rs. {Number(order.total || 0).toLocaleString()}
                  </strong>
                </div>

                <div>
                  <span>Delivery</span>
                  <strong>
                    {Number(order.delivery || 0) === 0
                      ? "Free"
                      : `Rs. ${Number(order.delivery).toLocaleString()}`}
                  </strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Orders;