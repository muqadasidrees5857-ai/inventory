const validateProduct = (req, res, next) => {
  const { name, category, price, quantity } = req.body;

  if (!name || !category || price === undefined || quantity === undefined) {
    return res.status(400).json({
      success: false,
      message: "Name, category, price and quantity are required."
    });
  }

  if (price < 0 || quantity < 0) {
    return res.status(400).json({
      success: false,
      message: "Price and quantity cannot be negative."
    });
  }

  next();
};

module.exports = validateProduct;