const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const validateProduct = require("../shared/middleware/validation");
const { supabase } = require("../config/supabase");

const app = express();
const PORT = process.env.PORT || 5001;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// =====================================================
// UPLOAD FOLDER
// =====================================================

const uploadDir = path.join(
  __dirname,
  "uploads",
  "products"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
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
    const extension = path.extname(file.originalname);

    const fileName =
      `product-${Date.now()}${extension}`;

    cb(null, fileName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed."
        )
      );
    }
  },
});

// =====================================================
// SERVE UPLOADED IMAGES
// =====================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// =====================================================
// GET ALL PRODUCTS
// =====================================================

app.get("/api/products", async (req, res) => {
  try {
    const {
      data: products,
      error,
    } = await supabase
      .from("products")
      .select("*")
      .order("id", {
        ascending: true,
      });

    if (error) {
      console.error(
        "SUPABASE GET PRODUCTS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      products: products || [],
    });
  } catch (error) {
    console.error(
      "GET PRODUCTS EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET SINGLE PRODUCT
// =====================================================

app.get("/api/products/:id", async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const {
      data: product,
      error,
    } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error(
        "GET SINGLE PRODUCT ERROR:",
        error
      );

      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "GET SINGLE PRODUCT EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// ADD PRODUCT
// =====================================================

app.post(
  "/api/products",
  upload.array("images", 6),
  validateProduct,
  async (req, res) => {
    try {
      console.log(
        "ADD PRODUCT REQUEST:",
        req.body
      );

      const {
        name,
        category,
        price,
        quantity,
        supplier,
      } = req.body;

      // =================================================
      // VALIDATION
      // =================================================

      if (
        !name ||
        !category ||
        price === undefined ||
        quantity === undefined ||
        !supplier
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, category, price, quantity and supplier are required.",
        });
      }

      // =================================================
      // IMAGES
      // =================================================

      const images = req.files
        ? req.files.map(
            (file) =>
              `/uploads/products/${file.filename}`
          )
        : [];

      const image =
        images.length > 0
          ? images[0]
          : "";

      // =================================================
      // INSERT INTO SUPABASE
      // =================================================

      const {
        data,
        error,
      } = await supabase
        .from("products")
        .insert([
          {
            name: name.trim(),
            category: category.trim(),
            price: Number(price),
            quantity: Number(quantity),
            supplier: supplier.trim(),
            image,
            images,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error(
          "SUPABASE ADD PRODUCT ERROR:",
          error
        );

        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      console.log(
        "PRODUCT ADDED:",
        data
      );

      return res.status(201).json({
        success: true,
        message:
          "Product added successfully!",
        product: data,
      });
    } catch (error) {
      console.error(
        "ADD PRODUCT EXCEPTION:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================================================
// UPDATE PRODUCT
// =====================================================

app.put(
  "/api/products/:id",
  upload.single("image"),
  validateProduct,
  async (req, res) => {
    try {
      const productId = Number(
        req.params.id
      );

      if (Number.isNaN(productId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID.",
        });
      }

      const {
        name,
        category,
        price,
        quantity,
        supplier,
      } = req.body;

      const updateData = {
        name,
        category,
        price: Number(price),
        quantity: Number(quantity),
        supplier,
      };

      // =================================================
      // UPDATE IMAGE
      // =================================================

      if (req.file) {
        updateData.image =
          `/uploads/products/${req.file.filename}`;
      }

      // =================================================
      // UPDATE SUPABASE
      // =================================================

      const {
        data,
        error,
      } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", productId)
        .select()
        .single();

      if (error) {
        console.error(
          "SUPABASE UPDATE PRODUCT ERROR:",
          error
        );

        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Product updated successfully!",
        product: data,
      });
    } catch (error) {
      console.error(
        "UPDATE PRODUCT EXCEPTION:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================================================
// DELETE PRODUCT
// =====================================================

app.delete(
  "/api/products/:id",
  async (req, res) => {
    try {
      const productId = Number(
        req.params.id
      );

      if (Number.isNaN(productId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID.",
        });
      }

      const {
        data,
        error,
      } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .select()
        .single();

      if (error) {
        console.error(
          "SUPABASE DELETE PRODUCT ERROR:",
          error
        );

        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Product deleted successfully!",
        product: data,
      });
    } catch (error) {
      console.error(
        "DELETE PRODUCT EXCEPTION:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================================================
// GET ALL ORDERS
// =====================================================

app.get(
  "/api/orders",
  async (req, res) => {
    try {
      const {
        data: orders,
        error,
      } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "SUPABASE GET ORDERS ERROR:",
          error
        );

        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      const formattedOrders =
        (orders || []).map(
          (order) => ({
            ...order,
            status:
              order.order_status,
            createdAt:
              order.created_at,
          })
        );

      return res.status(200).json({
        success: true,
        orders: formattedOrders,
      });
    } catch (error) {
      console.error(
        "GET ORDERS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
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
      const orderId = Number(
        req.params.id
      );

      if (Number.isNaN(orderId)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order ID.",
        });
      }

      const {
        data: order,
        error,
      } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) {
        console.error(
          "GET SINGLE ORDER ERROR:",
          error
        );

        return res.status(404).json({
          success: false,
          message:
            "Order not found.",
        });
      }

      const formattedOrder = {
        ...order,
        status:
          order.order_status,
        createdAt:
          order.created_at,
      };

      return res.status(200).json({
        success: true,
        order: formattedOrder,
      });
    } catch (error) {
      console.error(
        "GET SINGLE ORDER EXCEPTION:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================================================
// CREATE ORDER
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
        paymentDetails,
      } = req.body;

      // =================================================
      // CUSTOMER VALIDATION
      // =================================================

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
            "Customer name, phone, address and city are required.",
        });
      }

      // =================================================
      // ITEMS VALIDATION
      // =================================================

      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Order must contain products.",
        });
      }

      // =================================================
      // PAYMENT VALIDATION
      // =================================================

      if (!paymentMethod) {
        return res.status(400).json({
          success: false,
          message:
            "Payment method is required.",
        });
      }

      const allowedPaymentMethods = [
        "COD",
        "JazzCash",
        "Bank Transfer",
      ];

      if (
        !allowedPaymentMethods.includes(
          paymentMethod
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment method.",
        });
      }

      // =================================================
      // PAYMENT DETAILS
      // =================================================

      const details =
        paymentDetails || {};

      const accountNumber =
        paymentMethod === "JazzCash"
          ? details.accountNumber || null
          : null;

      const bankName =
        paymentMethod === "Bank Transfer"
          ? details.bankName || null
          : null;

      const accountTitle =
        paymentMethod === "Bank Transfer"
          ? details.accountTitle || null
          : null;

      // =================================================
      // INSERT ORDER
      // =================================================

      const {
        data,
        error,
      } = await supabase
        .from("orders")
        .insert([
          {
            customer,
            items,

            subtotal:
              Number(subtotal) || 0,

            delivery:
              Number(delivery) || 0,

            total:
              Number(total) || 0,

            payment_method:
              paymentMethod,

            payment_status:
              "Pending",

            payment_details:
              paymentDetails || {},

            account_number:
              accountNumber,

            bank_name:
              bankName,

            account_title:
              accountTitle,

            order_status:
              "Pending",
          },
        ])
        .select()
        .single();

      if (error) {
        console.error(
          "SUPABASE ORDER ERROR:",
          error
        );

        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      const formattedOrder = {
        ...data,
        status:
          data.order_status,
        createdAt:
          data.created_at,
      };

      return res.status(201).json({
        success: true,
        message:
          "Order placed successfully!",
        order: formattedOrder,
      });
    } catch (error) {
      console.error(
        "CREATE ORDER EXCEPTION:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

app.put(
  "/api/orders/:id/status",
  async (req, res) => {
    try {
      const orderId = Number(
        req.params.id
      );

      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (Number.isNaN(orderId)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order ID.",
        });
      }

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order status.",
        });
      }

      const {
        data,
        error,
      } = await supabase
        .from("orders")
        .update({
          order_status: status,
        })
        .eq("id", orderId)
        .select()
        .single();

      if (error) {
        console.error(
          "UPDATE ORDER STATUS ERROR:",
          error
        );

        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Order status updated successfully!",
        order: {
          ...data,
          status:
            data.order_status,
          createdAt:
            data.created_at,
        },
      });
    } catch (error) {
      console.error(
        "UPDATE ORDER STATUS EXCEPTION:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================================================
// UPDATE PAYMENT STATUS
// =====================================================

app.put(
  "/api/orders/:id/payment",
  async (req, res) => {
    try {
      const orderId = Number(
        req.params.id
      );

      const {
        paymentStatus,
      } = req.body;

      const allowedPaymentStatuses = [
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
      ];

      if (Number.isNaN(orderId)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order ID.",
        });
      }

      if (
        !allowedPaymentStatuses.includes(
          paymentStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment status.",
        });
      }

      const {
        data,
        error,
      } = await supabase
        .from("orders")
        .update({
          payment_status:
            paymentStatus,
        })
        .eq("id", orderId)
        .select()
        .single();

      if (error) {
        console.error(
          "UPDATE PAYMENT STATUS ERROR:",
          error
        );

        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Payment status updated successfully!",
        order: data,
      });
    } catch (error) {
      console.error(
        "UPDATE PAYMENT STATUS EXCEPTION:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Product Server is running!",
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (error, req, res, next) => {
    console.error(
      "GLOBAL PRODUCT SERVER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Something went wrong!",
    });
  }
);

// =====================================================
// START SERVER
// =====================================================

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `Product Server running on port ${PORT}`
    );
  }
);