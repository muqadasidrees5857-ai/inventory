const express = require("express");
const cors = require("cors");
const logger = require("../shared/middleware/logger");
const errorHandler = require("../shared/middleware/errorHandler");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);
// Product Service
app.get("/api/products", async (req, res, next) => {
  try {
    const response = await fetch("http://localhost:5001/api/products");
    const data = await response.json();

console.log("PRODUCT RESPONSE FROM 5001:", data);

res.status(response.status).json(data);
  } catch (error) {
    next(error);
  }
});
// Stock Service
app.get("/api/stock", async (req, res, next) => {
  try {
    const response = await fetch("http://localhost:5002/api/stock");
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    next(error);
  }
});
// Low Stock Service
app.get("/api/stock/low", async (req, res, next) => {
  try {
    const response = await fetch("http://localhost:5002/api/stock/low");
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    next(error);
  }
});
// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Inventory Management Main Server is running!"
  });
});
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Main Server running on http://localhost:${PORT}`);
});