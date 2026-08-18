const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message
  });
};

module.exports = errorHandler;