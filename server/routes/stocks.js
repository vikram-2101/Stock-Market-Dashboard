const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Get stock data for a company
router.get("/:companyId/stock-data", async (req, res) => {
  try {
    const { companyId } = req.params;
    const { days = 30 } = req.query;

    const result = await pool.query(
      `
      SELECT date, open_price, high_price, low_price, close_price, adj_close_price, volume
      FROM stock_data 
      WHERE company_id = $1 
      ORDER BY date DESC 
      LIMIT $2
    `,
      [companyId, parseInt(days)]
    );

    // Reverse to get chronological order
    const stockData = result.rows.reverse().map((row) => ({
      date: row.date.toISOString().split("T")[0],
      open: parseFloat(row.open_price),
      high: parseFloat(row.high_price),
      low: parseFloat(row.low_price),
      close: parseFloat(row.close_price),
      adjClose: row.adj_close_price ? parseFloat(row.adj_close_price) : null,
      volume: parseInt(row.volume),
    }));

    res.json(stockData);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get latest price for a company
router.get("/:companyId/latest-price", async (req, res) => {
  try {
    const { companyId } = req.params;
    const result = await pool.query(
      `
      SELECT close_price, date, volume, 
             LAG(close_price) OVER (ORDER BY date) as prev_close
      FROM stock_data 
      WHERE company_id = $1 
      ORDER BY date DESC 
      LIMIT 2
    `,
      [companyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No stock data found" });
    }

    const latest = result.rows[0];
    const previous = result.rows[1];

    const currentPrice = parseFloat(latest.close_price);
    const previousPrice = previous
      ? parseFloat(previous.close_price)
      : currentPrice;
    const change = currentPrice - previousPrice;
    const changePercent =
      previousPrice !== 0 ? (change / previousPrice) * 100 : 0;

    res.json({
      price: currentPrice,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      date: latest.date.toISOString().split("T")[0],
      volume: parseInt(latest.volume),
    });
  } catch (error) {
    console.error("Error fetching latest price:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add new stock data
router.post("/:companyId/stock-data", async (req, res) => {
  try {
    const { companyId } = req.params;
    const { date, open, high, low, close, volume } = req.body;

    // Validate required fields
    if (!date || !open || !high || !low || !close || !volume) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      `
      INSERT INTO stock_data (company_id, date, open_price, high_price, low_price, close_price, adj_close_price, volume)
      VALUES ($1, $2, $3, $4, $5, $6, $6, $7)
      ON CONFLICT (company_id, date) 
      DO UPDATE SET 
        open_price = EXCLUDED.open_price,
        high_price = EXCLUDED.high_price,
        low_price = EXCLUDED.low_price,
        close_price = EXCLUDED.close_price,
        adj_close_price = EXCLUDED.adj_close_price,
        volume = EXCLUDED.volume
      RETURNING *
    `,
      [companyId, date, open, high, low, close, volume]
    );

    res.status(201).json({
      message: "Stock data added successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding stock data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
