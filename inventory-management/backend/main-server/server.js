
const express = require("express");
const cors = require("cors");

const logger = require("../shared/middleware/logger");
const errorHandler = require("../shared/middleware/errorHandler");

const { supabase } = require("../config/supabase");

const app = express();
const PORT = 5000;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());
app.use(logger);

// =====================================================
// REGISTER - SUPABASE AUTH
// =====================================================

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: {
          name: cleanName,
          role: "user",
        },
      },
    });

    if (error) {
      console.error("Supabase Register Error:", error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: data.user,
    });
  } catch (error) {
    console.error("Register Error:", error);
    next(error);
  }
});

// =====================================================
// LOGIN - SUPABASE AUTH + LOGIN LOG
// =====================================================

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

    if (error) {
      console.error(
        "Supabase Login Error:",
        error.message
      );

      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = data.user;

    const {
      data: loginLog,
      error: loginLogError,
    } = await supabase
      .from("login_logs")
      .insert([
        {
          user_id: user.id,
          email: user.email,
        },
      ])
      .select();

    if (loginLogError) {
      console.error(
        "LOGIN LOG INSERT ERROR:",
        loginLogError.message
      );
    } else {
      console.log(
        "LOGIN LOG SAVED SUCCESSFULLY:",
        loginLog
      );
    }

    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: user,
      session: data.session,
    });
  } catch (error) {
    console.error("Login Error:", error);
    next(error);
  }
});

// =====================================================
// ORDERS ROUTES
// =====================================================

// Place Order
app.post("/api/orders", async (req, res, next) => {
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
          items: items,
          subtotal: subtotal,
          delivery_fee: delivery,
          total_amount: total,
          payment_method: paymentMethod,
          payment_details: paymentDetails,
          status: "Pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Order Save Error:", error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: data[0],
    });
  } catch (error) {
    console.error(
      "Order Route Exception:",
      error
    );

    next(error);
  }
});

// Fetch All Orders
app.get("/api/orders", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(200).json({
      success: true,
      orders: data,
    });
  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET PRODUCTS
// PROXY TO RAILWAY PRODUCT SERVER
// =====================================================

app.get("/api/products", async (req, res, next) => {
  try {
    const response = await fetch(
      "https://strong-curiosity-production.up.railway.app/api/products"
    );

    const data = await response.json();

    console.log(
      "PRODUCT RESPONSE FROM PRODUCT SERVER:",
      data
    );

    res.status(response.status).json(data);
  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET STOCK
// =====================================================

app.get("/api/stock", async (req, res, next) => {
  try {
    const response = await fetch(
      "http://localhost:5002/api/stock"
    );

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET LOW STOCK
// =====================================================

app.get(
  "/api/stock/low",
  async (req, res, next) => {
    try {
      const response = await fetch(
        "http://localhost:5002/api/stock/low"
      );

      const data = await response.json();

      res.status(response.status).json(data);
    } catch (error) {
      next(error);
    }
  }
);

// =====================================================
// MAIN SERVER TEST
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Inventory Management Main Server is running!",
  });
});

// =====================================================
// SUPABASE CONNECTION TEST
// =====================================================

app.get(
  "/api/test-supabase",
  async (req, res) => {
    try {
      const {
        data,
        error,
      } = await supabase.auth.getSession();

      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      res.json({
        success: true,
        message:
          "Supabase connected successfully!",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(errorHandler);

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `Main Server running on http://localhost:${PORT}`
  );
});
