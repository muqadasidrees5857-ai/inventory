const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Stock JSON file
const stockFile = path.join(
  __dirname,
  "../shared/data/stock.json"
);

// Get Stock
app.get("/api/stock", (req, res) => {
  try {
    const data = fs.readFileSync(stockFile, "utf-8");
    const stock = JSON.parse(data);

    res.json({
      success: true,
      stock
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to read stock."
    });
  }
});
// Update Stock
app.put("/api/stock/:id", (req, res) => {
  try {
    const data = fs.readFileSync(stockFile, "utf-8");
    const stock = JSON.parse(data);

    const stockId = parseInt(req.params.id);

    const stockIndex = stock.findIndex(
      (item) => item.id === stockId
    );

    if (stockIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Stock item not found."
      });
    }

    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required."
      });
    }

    stock[stockIndex].quantity = quantity;

    fs.writeFileSync(
      stockFile,
      JSON.stringify(stock, null, 2)
    );

    res.json({
      success: true,
      message: "Stock updated successfully!",
      stock: stock[stockIndex]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to update stock."
    });
  }
});
// Low Stock
app.get("/api/stock/low", (req, res) => {
  try {
    const data = fs.readFileSync(stockFile, "utf-8");
    const stock = JSON.parse(data);

    const lowStock = stock.filter(
      (item) => item.quantity <= item.reorderLevel
    );

    res.json({
      success: true,
      count: lowStock.length,
      lowStock
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to check low stock."
    });
  }
});
// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Stock Server is running!"
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Stock Server running on http://localhost:${PORT}`);
});