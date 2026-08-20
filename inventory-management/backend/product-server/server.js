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
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Pragma",
      "Expires",
    ],
  })
);

app.use(express.json());

// =====================================================
// UPLOAD FOLDER
// =====================================================

const uploadDir = path.join(__dirname, "uploads", "products");

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
    const fileName = `product-${Date.now()}${extension}`;
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
  express.static(path.join(__dirname, "uploads"))
);

// =====================================================
// GET ALL PRODUCTS
// =====================================================

app.get("/api/products", async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("SUPABASE GET PRODUCTS ERROR:", error);

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
    console.error("GET PRODUCTS EXCEPTION:", error);

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

    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("GET SINGLE PRODUCT ERROR:", error);

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
    console.error("GET SINGLE PRODUCT EXCEPTION:", error);

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
      console.log("ADD PRODUCT REQUEST:", req.body);

      const {
        name,
        category,
        price,
        quantity,
        supplier,
      } = req.body;

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

      const images = req.files
        ? req.files.map(
            (file) => `/uploads/products/${file.filename}`
          )
        : [];

      const image = images.length > 0 ? images[0] : "";

      const { data, error } = await supabase
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
        console.error("SUPABASE ADD PRODUCT ERROR:", error);

        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      console.log("PRODUCT ADDED:", data);

      return res.status(201).json({
        success: true,
        message: "Product added successfully!",
        product: data,
      });
    } catch (error) {
      console.error("ADD PRODUCT EXCEPTION:", error);

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
      const productId = Number(req.params.id);

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

      if (req.file) {
        updateData.image = `/uploads/products/${req.file.filename}`;
      }

      const { data, error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", productId)
        .select()
        .single();

      if (error) {
        console.error("SUPABASE UPDATE PRODUCT ERROR:", error);

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
        message: "Product updated successfully!",
        product: data,
      });
    } catch (error) {
      console.error("UPDATE PRODUCT EXCEPTION:", error);

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

app.delete("/api/products/:id", async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .select()
      .single();

    if (error) {
      console.error("SUPABASE DELETE PRODUCT ERROR:", error);

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
      message: "Product deleted successfully!",
      product: data,
    });
  } catch (error) {
    console.error("DELETE PRODUCT EXCEPTION:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET ALL ORDERS
// =====================================================

app.get("/api/orders", async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("SUPABASE GET ORDERS ERROR:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    const formattedOrders = (orders || []).map((order) => ({
      ...order,
      status: order.order_status,
      createdAt: order.created_at,
    }));

    return res.status(200).json({
      success: true,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("GET ORDERS EXCEPTION:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// PLACE ORDER
// =====================================================

app.post("/api/orders", async (req, res) => {
  try {
    const {
      customer,
      items,
      subtotal,
      delivery,
      total,
      paymentMethod,
      paymentDetails,
      userId,
      userEmail,
    } = req.body;

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId || null,
          user_email: userEmail || null,
          customer_name: customer?.name,
          customer_phone: customer?.phone,
          customer_address: customer?.address,
          customer_city: customer?.city,
          items,
          subtotal,
          delivery_fee: delivery,
          total_amount: total,
          payment_method: paymentMethod,
          payment_details: paymentDetails,
          order_status: "Pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("SUPABASE PLACE ORDER ERROR:", error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: data[0],
    });
  } catch (error) {
    console.error("PLACE ORDER EXCEPTION:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

app.put("/api/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from("orders")
      .update({ order_status: status })
      .eq("id", id)
      .select();

    if (error) {
      console.error("UPDATE STATUS ERROR:", error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      order: data[0],
    });
  } catch (error) {
    console.error("UPDATE STATUS EXCEPTION:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// AUTH LOGIN ROUTE
// =====================================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

    if (error) {
      console.error("SUPABASE LOGIN ERROR:", error);

      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    console.error("LOGIN EXCEPTION:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// AUTH REGISTER ROUTE
// =====================================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      console.error("SUPABASE REGISTER ERROR:", error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: data.user,
    });
  } catch (error) {
    console.error("REGISTER EXCEPTION:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(`Product server running on port ${PORT}`);
});