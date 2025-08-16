const validateStockData = (req, res, next) => {
  const { date, open, high, low, close, volume } = req.body;

  // Check required fields
  if (!date || !open || !high || !low || !close || !volume) {
    return res.status(400).json({
      error: "Missing required fields: date, open, high, low, close, volume",
    });
  }

  // Validate data types
  if (
    isNaN(open) ||
    isNaN(high) ||
    isNaN(low) ||
    isNaN(close) ||
    isNaN(volume)
  ) {
    return res.status(400).json({
      error: "Price and volume values must be numbers",
    });
  }

  // Validate date format
  if (!Date.parse(date)) {
    return res.status(400).json({
      error: "Invalid date format. Use YYYY-MM-DD",
    });
  }

  // Validate OHLC logic
  const prices = [
    parseFloat(open),
    parseFloat(high),
    parseFloat(low),
    parseFloat(close),
  ];
  const [o, h, l, c] = prices;

  if (h < Math.max(o, c) || l > Math.min(o, c)) {
    return res.status(400).json({
      error:
        "Invalid OHLC data: high must be >= open/close, low must be <= open/close",
    });
  }

  next();
};

const validateCompanyId = (req, res, next) => {
  const { companyId } = req.params;

  if (!companyId || isNaN(companyId)) {
    return res.status(400).json({
      error: "Valid company ID is required",
    });
  }

  next();
};

module.exports = {
  validateStockData,
  validateCompanyId,
};
