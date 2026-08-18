const express = require("express");
const cors = require("cors");

const { supabase } = require("../config/supabase");

const app = express();
const PORT = 5002;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// GET ALL STOCK
// FROM SUPABASE
// =====================================================

app.get("/api/stock", async (req, res) => {
  try {
    const {
      data: stock,
      error
    } = await supabase
      .from("stock")
      .select("*")
      .order("id", {
        ascending: true
      });

    if (error) {
      console.error(
        "Get Stock Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to read stock."
      });
    }

    res.json({
      success: true,
      stock
    });

  } catch (error) {
    console.error(
      "Stock Server Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to read stock."
    });
  }
});

// =====================================================
// ADD STOCK
// =====================================================

app.post("/api/stock", async (req, res) => {
  try {

    const {
      product_id,
      product_name,
      quantity,
      reorder_level
    } = req.body;

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!product_name) {
      return res.status(400).json({
        success: false,
        message: "Product name is required."
      });
    }

    if (
      quantity === undefined ||
      quantity < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required."
      });
    }

    // -------------------------------------------------
    // INSERT STOCK
    // -------------------------------------------------

    const {
      data,
      error
    } = await supabase
      .from("stock")
      .insert([
        {
          product_id:
            product_id || null,

          product_name:
            product_name.trim(),

          quantity:
            Number(quantity),

          reorder_level:
            Number(reorder_level) || 0
        }
      ])
      .select()
      .single();

    if (error) {
      console.error(
        "Add Stock Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to add stock."
      });
    }

    res.status(201).json({
      success: true,
      message: "Stock added successfully!",
      stock: data
    });

  } catch (error) {

    console.error(
      "Add Stock Server Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to add stock."
    });
  }
});

// =====================================================
// UPDATE STOCK
// =====================================================

app.put(
  "/api/stock/:id",
  async (req, res) => {

    try {

      const stockId =
        parseInt(req.params.id);

      if (isNaN(stockId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid stock ID."
        });
      }

      const {
        quantity,
        reorder_level
      } = req.body;

      // -------------------------------------------------
      // VALIDATION
      // -------------------------------------------------

      if (
        quantity === undefined ||
        Number(quantity) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Valid quantity is required."
        });
      }

      // -------------------------------------------------
      // UPDATE SUPABASE
      // -------------------------------------------------

      const {
        data,
        error
      } = await supabase
        .from("stock")
        .update({
          quantity:
            Number(quantity),

          ...(reorder_level !== undefined
            ? {
                reorder_level:
                  Number(reorder_level)
              }
            : {}),

          updated_at:
            new Date().toISOString()
        })
        .eq("id", stockId)
        .select()
        .single();

      if (error) {

        console.error(
          "Update Stock Error:",
          error
        );

        return res.status(500).json({
          success: false,
          message:
            "Unable to update stock."
        });
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          message:
            "Stock item not found."
        });
      }

      res.json({
        success: true,
        message:
          "Stock updated successfully!",
        stock: data
      });

    } catch (error) {

      console.error(
        "Update Stock Server Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to update stock."
      });
    }
  }
);

// =====================================================
// LOW STOCK
// =====================================================

app.get(
  "/api/stock/low",
  async (req, res) => {

    try {

      const {
        data: stock,
        error
      } = await supabase
        .from("stock")
        .select("*")
        .order("quantity", {
          ascending: true
        });

      if (error) {

        console.error(
          "Low Stock Error:",
          error
        );

        return res.status(500).json({
          success: false,
          message:
            "Unable to check low stock."
        });
      }

      // -------------------------------------------------
      // FILTER LOW STOCK
      // -------------------------------------------------

      const lowStock =
        (stock || []).filter(
          (item) =>
            Number(item.quantity) <=
            Number(item.reorder_level)
        );

      res.json({
        success: true,
        count:
          lowStock.length,
        lowStock
      });

    } catch (error) {

      console.error(
        "Low Stock Server Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to check low stock."
      });
    }
  }
);

// =====================================================
// GET SINGLE STOCK
// =====================================================

app.get(
  "/api/stock/:id",
  async (req, res) => {

    try {

      const stockId =
        parseInt(req.params.id);

      if (isNaN(stockId)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid stock ID."
        });
      }

      const {
        data,
        error
      } = await supabase
        .from("stock")
        .select("*")
        .eq("id", stockId)
        .single();

      if (error) {

        return res.status(404).json({
          success: false,
          message:
            "Stock item not found."
        });
      }

      res.json({
        success: true,
        stock: data
      });

    } catch (error) {

      console.error(
        "Get Stock Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to get stock."
      });
    }
  }
);

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {

  res.json({
    success: true,
    message:
      "Stock Server is running!"
  });

});

// =====================================================
// START SERVER
// =====================================================

app.listen(
  PORT,
  () => {

    console.log(
      `Stock Server running on http://localhost:${PORT}`
    );

  }
);