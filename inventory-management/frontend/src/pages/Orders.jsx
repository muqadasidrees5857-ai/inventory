import { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = `${import.meta.env.VITE_API_URL}/api/products/${product.id}`,

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const response = await axios.get(API_URL);

      if (response.data.success) {
        const fetchedOrders = response.data.orders || [];

        setOrders(
          [...fetchedOrders].sort(
            (a, b) =>
              new Date(b.createdAt || b.created_at) -
              new Date(a.createdAt || a.created_at)
          )
        );
      } else {
        setOrders([]);
        setError("Unable to load orders.");
      }
    } catch (err) {
      console.error("Unable to fetch orders:", err);

      setError(
        "Unable to load orders. Make sure Product Server is running on port 5001."
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchOrders(true);
  }, []);

  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateStatus = async (orderId, newStatus) => {
    try {
      console.log(
        "Updating order:",
        orderId,
        "to:",
        newStatus
      );

      const response = await axios.put(
        `${API_URL}/${orderId}/status`,
        {
          status: newStatus,
        }
      );

      console.log(
        "Update response:",
        response.data
      );

      if (response.data.success) {
        const updatedOrder = response.data.order;

        // IMPORTANT:
        // Backend already returns:
        // status: updatedOrder.order_status

        setOrders((previousOrders) =>
          previousOrders.map((order) =>
            Number(order.id) === Number(orderId)
              ? {
                  ...order,
                  ...updatedOrder,
                  status:
                    updatedOrder.status ||
                    updatedOrder.order_status ||
                    newStatus,
                }
              : order
          )
        );
      } else {
        alert(
          response.data.message ||
            "Unable to update order status."
        );
      }
    } catch (err) {
      console.error(
        "Unable to update order status:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to update order status."
      );

      // Server ki latest value dobara load
      fetchOrders(false);
    }
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock size={15} />;

      case "Processing":
        return <RefreshCw size={15} />;

      case "Shipped":
        return <Truck size={15} />;

      case "Delivered":
        return <CheckCircle size={15} />;

      case "Cancelled":
        return <XCircle size={15} />;

      default:
        return <Clock size={15} />;
    }
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    const currentStatus = status || "Pending";

    return `order-status-badge status-${currentStatus
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="orders-page">

        <div className="page-header">
          <div>
            <span className="page-eyebrow">
              ORDER MANAGEMENT
            </span>

            <h1>Orders</h1>

            <p>
              Manage customer orders and delivery status.
            </p>
          </div>
        </div>

        <div className="orders-empty">

          <Package size={42} />

          <h2>Loading Orders...</h2>

          <p>
            Please wait while we load customer orders.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="orders-page">

        <div className="page-header">
          <div>
            <span className="page-eyebrow">
              ORDER MANAGEMENT
            </span>

            <h1>Orders</h1>

            <p>
              Manage customer orders and delivery status.
            </p>
          </div>
        </div>

        <div className="orders-empty">

          <XCircle size={42} />

          <h2>Unable to Load Orders</h2>

          <p>{error}</p>

          <button
            className="primary-btn"
            onClick={() => fetchOrders(true)}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // STATISTICS
  // =====================================================

  const pendingOrders = orders.filter(
    (order) =>
      (order.status || order.order_status) ===
      "Pending"
  ).length;

  const processingOrders = orders.filter(
    (order) =>
      (order.status || order.order_status) ===
      "Processing"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      (order.status || order.order_status) ===
      "Delivered"
  ).length;

  // =====================================================
  // NO ORDERS
  // =====================================================

  if (orders.length === 0) {
    return (
      <div className="orders-page">

        <div className="page-header">

          <div>
            <span className="page-eyebrow">
              ORDER MANAGEMENT
            </span>

            <h1>Orders</h1>

            <p>
              Manage customer orders and delivery status.
            </p>
          </div>

          <button
            className="orders-refresh-btn"
            onClick={() => fetchOrders(true)}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </div>

        <div className="orders-empty">

          <Package size={42} />

          <h2>No Orders Yet</h2>

          <p>
            Customer orders will appear here when
            customers complete checkout.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="orders-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="page-header">

        <div>

          <span className="page-eyebrow">
            ORDER MANAGEMENT
          </span>

          <h1>Orders</h1>

          <p>
            Manage customer orders and delivery status.
          </p>

        </div>

        <div className="orders-header-actions">

          <div className="orders-count">

            <Package size={17} />

            <span>
              {orders.length}{" "}
              {orders.length === 1
                ? "Order"
                : "Orders"}
            </span>

          </div>

          <button
            className="orders-refresh-btn"
            onClick={() => fetchOrders(true)}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </div>

      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="stats-grid">

        {/* TOTAL */}

        <div className="stat-card">

          <div className="stat-icon">
            <Package size={21} />
          </div>

          <div>

            <span>Total Orders</span>

            <h2>
              {orders.length}
            </h2>

            <small>
              All customer orders
            </small>

          </div>

        </div>

        {/* PENDING */}

        <div className="stat-card warning-card">

          <div className="stat-icon">
            <Clock size={21} />
          </div>

          <div>

            <span>Pending</span>

            <h2>
              {pendingOrders}
            </h2>

            <small>
              Awaiting processing
            </small>

          </div>

        </div>

        {/* PROCESSING */}

        <div className="stat-card">

          <div className="stat-icon">
            <Truck size={21} />
          </div>

          <div>

            <span>Processing</span>

            <h2>
              {processingOrders}
            </h2>

            <small>
              Currently processing
            </small>

          </div>

        </div>

        {/* DELIVERED */}

        <div className="stat-card">

          <div className="stat-icon">
            <CheckCircle size={21} />
          </div>

          <div>

            <span>Delivered</span>

            <h2>
              {deliveredOrders}
            </h2>

            <small>
              Successfully delivered
            </small>

          </div>

        </div>

      </div>

      {/* =================================================
          ORDERS LIST
      ================================================= */}

      <div className="orders-list">

        {orders.map((order) => {

          const currentStatus =
            order.status ||
            order.order_status ||
            "Pending";

          return (
            <div
              className="order-card"
              key={order.id}
            >

              {/* =========================================
                  ORDER HEADER
              ========================================= */}

              <div className="order-card-header">

                <div>

                  <span className="order-number">
                    ORDER #{order.id}
                  </span>

                  <h2>
                    Customer Order
                  </h2>

                </div>

                {/* STATUS */}

                <div className="order-status-wrapper">

                  <label>
                    Status
                  </label>

                  <div className="order-status-box">

                    {/* STATUS BADGE */}

                    <span
                      className={getStatusClass(
                        currentStatus
                      )}
                    >

                      {getStatusIcon(
                        currentStatus
                      )}

                      {currentStatus}

                    </span>

                    {/* STATUS SELECT */}

                    <select
                      className="order-status"
                      value={currentStatus}
                      onChange={(e) => {

                        const newStatus =
                          e.target.value;

                        updateStatus(
                          order.id,
                          newStatus
                        );

                      }}
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Processing">
                        Processing
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>

                    </select>

                  </div>

                </div>

              </div>

              {/* =========================================
                  CUSTOMER INFORMATION
              ========================================= */}

              <div className="order-customer">

                <h3>
                  Customer Information
                </h3>

                <div className="customer-info-grid">

                  {/* NAME */}

                  <div className="customer-info-item">

                    <User size={17} />

                    <div>

                      <span>
                        Name
                      </span>

                      <strong>
                        {order.customer?.name ||
                          "N/A"}
                      </strong>

                    </div>

                  </div>

                  {/* PHONE */}

                  <div className="customer-info-item">

                    <Phone size={17} />

                    <div>

                      <span>
                        Phone
                      </span>

                      <strong>
                        {order.customer?.phone ||
                          "N/A"}
                      </strong>

                    </div>

                  </div>

                  {/* ADDRESS */}

                  <div className="customer-info-item">

                    <MapPin size={17} />

                    <div>

                      <span>
                        Address
                      </span>

                      <strong>
                        {order.customer?.address ||
                          "N/A"}
                      </strong>

                    </div>

                  </div>

                  {/* CITY */}

                  <div className="customer-info-item">

                    <MapPin size={17} />

                    <div>

                      <span>
                        City
                      </span>

                      <strong>
                        {order.customer?.city ||
                          "N/A"}
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

              {/* =========================================
                  ORDERED PRODUCTS
              ========================================= */}

              <div className="order-products">

                <h3>
                  Ordered Products
                </h3>

                <div>

                  {order.items?.map(
                    (item, index) => {

                      const imageUrl =
                        item.image
                          ? item.image.startsWith(
                              "http"
                            )
                            ? item.image
                            : `${import.meta.env.VITE_API_URL}${item.image}`
                          : "";

                      return (
                        <div
                          className="order-product"
                          key={`${item.id}-${index}`}
                        >

                          {/* IMAGE */}

                          <div className="order-product-icon">

                            {imageUrl ? (

                              <img
                                src={imageUrl}
                                alt={
                                  item.name
                                }
                              />

                            ) : (

                              <Package
                                size={21}
                              />

                            )}

                          </div>

                          {/* INFO */}

                          <div className="order-product-info">

                            <strong>
                              {item.name}
                            </strong>

                            <span>
                              {item.category ||
                                "Product"}
                            </span>

                          </div>

                          {/* QUANTITY */}

                          <div className="order-product-qty">

                            ×{" "}
                            {item.cartQuantity ||
                              0}

                          </div>

                          {/* PRICE */}

                          <div className="order-product-price">

                            Rs.{" "}

                            {(
                              Number(
                                item.price || 0
                              ) *
                              Number(
                                item.cartQuantity ||
                                  0
                              )
                            ).toLocaleString()}

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>

              {/* =========================================
                  ORDER SUMMARY
              ========================================= */}

              <div className="order-summary">

                {/* SUBTOTAL */}

                <div>

                  <span>
                    Subtotal
                  </span>

                  <strong>
                    Rs.{" "}
                    {Number(
                      order.subtotal || 0
                    ).toLocaleString()}
                  </strong>

                </div>

                {/* DELIVERY */}

                <div>

                  <span>
                    Delivery
                  </span>

                  <strong>

                    {Number(
                      order.delivery || 0
                    ) === 0
                      ? "Free"
                      : `Rs. ${Number(
                          order.delivery
                        ).toLocaleString()}`}

                  </strong>

                </div>

                {/* TOTAL */}

                <div className="summary-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    Rs.{" "}
                    {Number(
                      order.total || 0
                    ).toLocaleString()}
                  </strong>

                </div>

              </div>

              {/* =========================================
                  ORDER FOOTER
              ========================================= */}

              <div className="order-card-footer">

                {/* DATE */}

                <div className="order-date">

                  <Calendar size={15} />

                  <span>

                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleString(
                          "en-PK",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "Date not available"}

                  </span>

                </div>

                {/* STATUS */}

                <div className="order-total">

                  <span>
                    Order Status
                  </span>

                  <strong>
                    {currentStatus}
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