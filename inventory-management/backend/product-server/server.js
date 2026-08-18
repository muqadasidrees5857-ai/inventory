const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const validateProduct = require("../shared/middleware/validation");
const { supabase } = require("../config/supabase");

const app = express();
const PORT = 5001;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// UPLOAD FOLDER
// =====================================================

const uploadDir = path.join(
  __dirname,
  "uploads/products"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true
  });
}

// =====================================================
// MULTER CONFIGURATION
// =====================================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {

    const extension =
      path.extname(file.originalname);

    const fileName =
      `product-${Date.now()}${extension}`;

    cb(null, fileName);
  }

});

const upload = multer({

  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp"
    ];

    if (
      allowedTypes.includes(
        file.mimetype
      )
    ) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed."
        )
      );

    }

  }

});

// =====================================================
// SERVE UPLOADED IMAGES
// =====================================================

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);

// =====================================================
// GET PRODUCTS
// FROM SUPABASE
// =====================================================

app.get(
  "/api/products",
  async (req, res) => {

    try {

      const {
        data: products,
        error
      } = await supabase
        .from("products")
        .select("*")
        .order("id", {
          ascending: true
        });

      if (error) {
        throw error;
      }

      res.json({

        success: true,

        products

      });

    } catch (error) {

      console.error(
        "Get Products Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Unable to read products."

      });

    }

  }
);

// =====================================================
// ADD PRODUCT + IMAGE
// TO SUPABASE
// =====================================================

app.post(
  "/api/products",
  upload.array("images", 6),
  validateProduct,
  async (req, res) => {

    try {

      const {
        name,
        category,
        price,
        quantity,
        supplier
      } = req.body;

      // -------------------------------------------------
      // MULTIPLE IMAGES
      // -------------------------------------------------

      const images =
        req.files
          ? req.files.map(
              (file) =>
                `/uploads/products/${file.filename}`
            )
          : [];

      // -------------------------------------------------
      // MAIN IMAGE
      // -------------------------------------------------

      const image =
        req.files &&
        req.files.length > 0
          ? `/uploads/products/${req.files[0].filename}`
          : "";

      // -------------------------------------------------
      // INSERT PRODUCT
      // -------------------------------------------------

      const {
        data,
        error
      } = await supabase
        .from("products")
        .insert([
          {

            name,

            category,

            price:
              Number(price),

            quantity:
              Number(quantity),

            supplier,

            image,

            images

          }
        ])
        .select();

      if (error) {
        throw error;
      }

      res.status(201).json({

        success: true,

        message:
          "Product added successfully!",

        product:
          data[0]

      });

    } catch (error) {

      console.error(
        "Add Product Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Unable to add product."

      });

    }

  }
);

// =====================================================
// UPDATE PRODUCT + IMAGE
// =====================================================

app.put(
  "/api/products/:id",
  upload.single("image"),
  validateProduct,
  async (req, res) => {

    try {

      const productId =
        parseInt(req.params.id);

      const {
        name,
        category,
        price,
        quantity,
        supplier
      } = req.body;

      const updateData = {

        name,

        category,

        price:
          Number(price),

        quantity:
          Number(quantity),

        supplier

      };

      // -------------------------------------------------
      // UPDATE IMAGE
      // -------------------------------------------------

      if (req.file) {

        updateData.image =
          `/uploads/products/${req.file.filename}`;

      }

      const {
        data,
        error
      } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", productId)
        .select();

      if (error) {
        throw error;
      }

      if (
        !data ||
        data.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found."

        });

      }

      res.json({

        success: true,

        message:
          "Product updated successfully!",

        product:
          data[0]

      });

    } catch (error) {

      console.error(
        "Update Product Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Unable to update product."

      });

    }

  }
);

// =====================================================
// DELETE PRODUCT
// FROM SUPABASE
// =====================================================

app.delete(
  "/api/products/:id",
  async (req, res) => {

    try {

      const productId =
        parseInt(req.params.id);

      const {
        data,
        error
      } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .select();

      if (error) {
        throw error;
      }

      if (
        !data ||
        data.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found."

        });

      }

      res.json({

        success: true,

        message:
          "Product deleted successfully!",

        product:
          data[0]

      });

    } catch (error) {

      console.error(
        "Delete Product Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Unable to delete product."

      });

    }

  }
);

// =====================================================
// TEST ROUTE
// =====================================================

app.get(
  "/",
  (req, res) => {

    res.json({

      success: true,

      message:
        "Product Server is running!"

    });

  }
);

// =====================================================
// ORDERS
// SUPABASE
// =====================================================


// =====================================================
// GET ALL ORDERS
// =====================================================

app.get(
  "/api/orders",
  async (req, res) => {

    try {

      const {
        data: orders,
        error
      } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", {
          ascending: false
        });

      if (error) {
        throw error;
      }

      // -------------------------------------------------
      // FORMAT ORDERS
      // -------------------------------------------------

      const formattedOrders =
        (orders || []).map(
          (order) => ({

            ...order,

            status:
              order.order_status,

            createdAt:
              order.created_at

          })
        );

      res.json({

        success: true,

        orders:
          formattedOrders

      });

    } catch (error) {

      console.error(
        "Get Orders Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Unable to read orders."

      });

    }

  }
);

// =====================================================
// GET SINGLE ORDER
// =====================================================

app.get(
  "/api/orders/:id",
  async (req, res) => {

    try {

      const orderId =
        parseInt(req.params.id);

      if (isNaN(orderId)) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid order ID."

        });

      }

      const {
        data: order,
        error
      } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) {
        throw error;
      }

      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found."

        });

      }

      const formattedOrder = {

        ...order,

        status:
          order.order_status,

        createdAt:
          order.created_at

      };

      res.json({

        success: true,

        order:
          formattedOrder

      });

    } catch (error) {

      console.error(
        "Get Single Order Error:",
        error
      );

      res.status(404).json({

        success: false,

        message:
          "Order not found."

      });

    }

  }
);

// =====================================================
// CREATE ORDER
// SAVE TO SUPABASE
// =====================================================

app.post(
  "/api/orders",
  async (req, res) => {

    try {

      const {
        customer,
        items,
        subtotal,
        delivery,
        total,
        paymentMethod,
        paymentDetails
      } = req.body;

      // -------------------------------------------------
      // CUSTOMER VALIDATION
      // -------------------------------------------------

      if (
        !customer ||
        !customer.name ||
        !customer.phone ||
        !customer.address ||
        !customer.city
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Customer name, phone, address and city are required."

        });

      }

      // -------------------------------------------------
      // ITEMS VALIDATION
      // -------------------------------------------------

      if (
        !items ||
        !Array.isArray(items) ||
        items.length === 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Order must contain products."

        });

      }

      // -------------------------------------------------
      // PAYMENT VALIDATION
      // -------------------------------------------------

      if (!paymentMethod) {

        return res.status(400).json({

          success: false,

          message:
            "Payment method is required."

        });

      }

      // -------------------------------------------------
      // ALLOWED PAYMENT METHODS
      // -------------------------------------------------

      const allowedPaymentMethods = [
        "COD",
        "JazzCash",
        "Bank Transfer"
      ];

      if (
        !allowedPaymentMethods.includes(
          paymentMethod
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid payment method."

        });

      }

      // -------------------------------------------------
      // PAYMENT DETAILS
      // -------------------------------------------------

      const details =
        paymentDetails || {};

      // -------------------------------------------------
      // ACCOUNT NUMBER
      // JazzCash
      // -------------------------------------------------

      const accountNumber =
        paymentMethod === "JazzCash"
          ? details.accountNumber ||
            null
          : null;

      // -------------------------------------------------
      // BANK NAME
      // Bank Transfer
      // -------------------------------------------------

      const bankName =
        paymentMethod === "Bank Transfer"
          ? details.bankName ||
            null
          : null;

      // -------------------------------------------------
      // ACCOUNT TITLE
      // Bank Transfer
      // -------------------------------------------------

      const accountTitle =
        paymentMethod === "Bank Transfer"
          ? details.accountTitle ||
            null
          : null;

      // -------------------------------------------------
      // INSERT ORDER INTO SUPABASE
      // -------------------------------------------------

      const {
        data,
        error
      } = await supabase
        .from("orders")
        .insert([

          {

            // Customer
            customer,

            // Products
            items,

            // Amounts
            subtotal:
              Number(subtotal) || 0,

            delivery:
              Number(delivery) || 0,

            total:
              Number(total) || 0,

            // Payment Method
            payment_method:
              paymentMethod,

            // Payment Status
            payment_status:
              "Pending",

            // Complete Payment Details
            payment_details:
              paymentDetails || {},

            // =================================================
            // NEW PAYMENT COLUMNS
            // =================================================

            account_number:
              accountNumber,

            bank_name:
              bankName,

            account_title:
              accountTitle,

            // =================================================
            // ORDER STATUS
            // =================================================

            order_status:
              "Pending"

          }

        ])
        .select()
        .single();

      // -------------------------------------------------
      // SUPABASE ERROR
      // -------------------------------------------------

      if (error) {

        console.error(
          "Supabase Order Error:",
          error
        );

        return res.status(500).json({

          success: false,

          message:
            error.message ||
            "Unable to save order."

        });

      }

      // -------------------------------------------------
      // FORMAT RESPONSE
      // -------------------------------------------------

      const formattedOrder = {

        ...data,

        status:
          data.order_status,

        createdAt:
          data.created_at

      };

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      res.status(201).json({

        success: true,

        message:
          "Order placed successfully!",

        order:
          formattedOrder

      });

    } catch (error) {

      console.error(
        "Create Order Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Unable to place order."

      });

    }

  }
);

// =====================================================
// UPDATE ORDER STATUS
// SUPABASE
// =====================================================

app.put(
  "/api/orders/:id/status",
  async (req, res) => {

    try {

      const orderId =
        parseInt(req.params.id);

      const {
        status
      } = req.body;

      // -------------------------------------------------
      // VALIDATE ID
      // -------------------------------------------------

      if (isNaN(orderId)) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid order ID."

        });

      }

      // -------------------------------------------------
      // ALLOWED STATUSES
      // -------------------------------------------------

      const allowedStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid order status."

        });

      }

      // -------------------------------------------------
      // UPDATE SUPABASE
      // -------------------------------------------------

      const {
        data,
        error
      } = await supabase
        .from("orders")
        .update({

          order_status:
            status

        })
        .eq("id", orderId)
        .select()
        .single();

      if (error) {

        console.error(
          "Supabase Update Order Error:",
          error
        );

        throw error;

      }

      // -------------------------------------------------
      // ORDER NOT FOUND
      // -------------------------------------------------

      if (!data) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found."

        });

      }

      // -------------------------------------------------
      // FORMAT UPDATED ORDER
      // -------------------------------------------------

      const formattedOrder = {

        ...data,

        status:
          data.order_status,

        createdAt:
          data.created_at

      };

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      res.json({

        success: true,

        message:
          "Order status updated successfully!",

        order:
          formattedOrder

      });

    } catch (error) {

      console.error(
        "Update Order Status Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Unable to update order status."

      });

    }

  }
);

// =====================================================
// UPDATE PAYMENT STATUS
// SUPABASE
// =====================================================

app.put(
  "/api/orders/:id/payment",
  async (req, res) => {

    try {

      const orderId =
        parseInt(req.params.id);

      const {
        paymentStatus
      } = req.body;

      // -------------------------------------------------
      // VALIDATE PAYMENT STATUS
      // -------------------------------------------------

      const allowedPaymentStatuses = [
        "Pending",
        "Paid",
        "Failed",
        "Refunded"
      ];

      if (
        !allowedPaymentStatuses.includes(
          paymentStatus
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid payment status."

        });

      }

      // -------------------------------------------------
      // UPDATE SUPABASE
      // -------------------------------------------------

      const {
        data,
        error
      } = await supabase
        .from("orders")
        .update({

          payment_status:
            paymentStatus

        })
        .eq("id", orderId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      res.json({

        success: true,

        message:
          "Payment status updated successfully!",

        order:
          data

      });

    } catch (error) {

      console.error(
        "Update Payment Status Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Unable to update payment status."

      });

    }

  }
);

// =====================================================
// START SERVER
// =====================================================

app.listen(
  PORT,
  () => {

    console.log(
      `Product Server running on http://localhost:${PORT}`
    );

  }
);