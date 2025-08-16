// export const formatPrice = (price) => {
//   return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
// };

// export const formatVolume = (volume) => {
//   if (volume >= 10000000) {
//     return `${(volume / 10000000).toFixed(1)}Cr`;
//   } else if (volume >= 100000) {
//     return `${(volume / 100000).toFixed(1)}L`;
//   } else if (volume >= 1000) {
//     return `${(volume / 1000).toFixed(1)}K`;
//   }
//   return volume.toString();
// };

// export const formatMarketCap = (marketCap) => {
//   if (marketCap >= 10000000) {
//     return `₹${(marketCap / 10000000).toFixed(0)} Cr`;
//   } else if (marketCap >= 100000) {
//     return `₹${(marketCap / 100000).toFixed(0)} L`;
//   }
//   return `₹${marketCap.toLocaleString('en-IN')}`;
// };

// export const formatPercentage = (percentage) => {
//   const sign = percentage >= 0 ? '+' : '';
//   return `${sign}${percentage.toFixed(2)}%`;
// };

// export const formatDate = (dateString) => {
//   return new Date(dateString).toLocaleDateString('en-IN', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric'
//   });
// };
//     };

//     fetchStockData();
//   }, [companyId, days]);

//   return { stockData, loading, error, refetch: () => fetchStockData() };
// };

// frontend/src/utils/formatters.js

/**
 * Format currency values with Indian Rupee symbol
 * @param {number} value - The numeric value to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.compact - Whether to use compact notation (K, L, Cr)
 * @param {boolean} options.hideSymbol - Whether to hide the currency symbol
 * @param {number} options.decimals - Number of decimal places
 */
export const formatCurrency = (value, options = {}) => {
  if (value === null || value === undefined || isNaN(value)) {
    return "₹0.00";
  }

  const { compact = false, hideSymbol = false, decimals = 2 } = options;
  const symbol = hideSymbol ? "" : "₹";

  if (compact) {
    // Indian numbering system: K, L, Cr
    if (value >= 10000000) {
      // 1 Crore
      return `${symbol}${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      // 1 Lakh
      return `${symbol}${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      // 1 Thousand
      return `${symbol}${(value / 1000).toFixed(1)}K`;
    }
  }

  // Standard formatting with Indian locale
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
    .format(value)
    .replace("₹", symbol);
};

/**
 * Format percentage values
 * @param {number} value - The percentage value (as decimal or percentage)
 * @param {Object} options - Formatting options
 * @param {boolean} options.isDecimal - Whether input is in decimal form (0.05 = 5%)
 * @param {number} options.decimals - Number of decimal places
 */
export const formatPercentage = (value, options = {}) => {
  if (value === null || value === undefined || isNaN(value)) {
    return "0.00%";
  }

  const { isDecimal = false, decimals = 2 } = options;
  const percentage = isDecimal ? value * 100 : value;

  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Format large numbers with appropriate suffixes
 * @param {number} value - The numeric value to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.compact - Whether to use compact notation
 * @param {number} options.decimals - Number of decimal places
 */
export const formatNumber = (value, options = {}) => {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }

  const { compact = false, decimals = 0 } = options;

  if (compact) {
    // Indian numbering system
    if (value >= 10000000) {
      // 1 Crore
      return `${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      // 1 Lakh
      return `${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      // 1 Thousand
      return `${(value / 1000).toFixed(1)}K`;
    }
  }

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format date values
 * @param {Date|string} date - The date to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.short - Whether to use short format
 * @param {boolean} options.time - Whether to include time
 * @param {string} options.locale - Locale for formatting
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "N/A";

  const { short = false, time = false, locale = "en-IN" } = options;
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  if (short) {
    return dateObj.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
    });
  }

  const formatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (time) {
    formatOptions.hour = "2-digit";
    formatOptions.minute = "2-digit";
  }

  return dateObj.toLocaleDateString(locale, formatOptions);
};

/**
 * Format time duration in human readable format
 * @param {number} milliseconds - Duration in milliseconds
 */
export const formatDuration = (milliseconds) => {
  if (!milliseconds || milliseconds < 0) return "0s";

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Format market status
 * @param {string} status - Market status string
 */
export const formatMarketStatus = (status) => {
  const statusMap = {
    OPEN: { text: "Market Open", color: "text-green-600" },
    CLOSED: { text: "Market Closed", color: "text-red-600" },
    PRE_OPEN: { text: "Pre-Open", color: "text-yellow-600" },
    POST_CLOSE: { text: "After Hours", color: "text-blue-600" },
  };

  return statusMap[status] || { text: status, color: "text-gray-600" };
};

/**
 * Format volume with appropriate suffixes
 * @param {number} volume - Trading volume
 */
export const formatVolume = (volume) => {
  if (!volume || volume === 0) return "0";

  if (volume >= 10000000) {
    return `${(volume / 10000000).toFixed(1)}Cr`;
  } else if (volume >= 100000) {
    return `${(volume / 100000).toFixed(1)}L`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }

  return volume.toLocaleString("en-IN");
};

/**
 * Calculate and format price change
 * @param {number} current - Current price
 * @param {number} previous - Previous price
 */
export const formatPriceChange = (current, previous) => {
  if (!current || !previous) {
    return {
      absolute: "₹0.00",
      percentage: "0.00%",
      isPositive: true,
      isNeutral: true,
    };
  }

  const change = current - previous;
  const changePercent = (change / previous) * 100;
  const isPositive = change >= 0;
  const isNeutral = change === 0;

  return {
    absolute: `${isPositive && !isNeutral ? "+" : ""}${formatCurrency(change)}`,
    percentage: `${isPositive && !isNeutral ? "+" : ""}${formatPercentage(
      changePercent
    )}`,
    isPositive,
    isNeutral,
  };
};

/**
 * Format market cap with appropriate Indian suffixes
 * @param {number} marketCap - Market capitalization value
 */
export const formatMarketCap = (marketCap) => {
  if (!marketCap || marketCap === 0) return "₹0";

  if (marketCap >= 1000000000000) {
    // 1 Lakh Crore
    return `₹${(marketCap / 1000000000000).toFixed(2)} Lakh Cr`;
  } else if (marketCap >= 10000000000) {
    // 1000 Crore
    return `₹${(marketCap / 10000000000).toFixed(0)} Thousand Cr`;
  } else if (marketCap >= 10000000) {
    // 1 Crore
    return `₹${(marketCap / 10000000).toFixed(0)} Cr`;
  } else if (marketCap >= 100000) {
    // 1 Lakh
    return `₹${(marketCap / 100000).toFixed(1)} L`;
  }

  return formatCurrency(marketCap, { compact: true });
};

/**
 * Validate and sanitize numeric inputs
 * @param {any} value - Value to validate
 * @param {number} fallback - Fallback value if invalid
 */
export const sanitizeNumber = (value, fallback = 0) => {
  const num = parseFloat(value);
  return isNaN(num) || !isFinite(num) ? fallback : num;
};

/**
 * Format Indian stock exchange codes
 * @param {string} exchange - Exchange code (NSE, BSE, etc.)
 */
export const formatExchange = (exchange) => {
  const exchangeMap = {
    NSE: "National Stock Exchange",
    BSE: "Bombay Stock Exchange",
    MCX: "Multi Commodity Exchange",
  };

  return exchangeMap[exchange] || exchange;
};

/**
 * Calculate moving average for stock data
 * @param {Array} data - Array of stock data points
 * @param {number} period - Period for moving average
 * @param {string} field - Field to calculate average for (default: 'close')
 */
export const calculateMovingAverage = (data, period, field = "close") => {
  if (!data || data.length < period) return [];

  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data
      .slice(i - period + 1, i + 1)
      .reduce((acc, item) => acc + (item[field] || 0), 0);
    result.push({
      date: data[i].date,
      value: sum / period,
    });
  }
  return result;
};
