const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Get market summary
router.get("/summary", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.symbol,
        c.name,
        c.sector,
        c.market_cap,
        sd.close_price as current_price,
        sd.volume,
        sd.date,
        prev.close_price as prev_price
      FROM companies c
      LEFT JOIN LATERAL (
        SELECT close_price, volume, date
        FROM stock_data
        WHERE company_id = c.id
        ORDER BY date DESC
        LIMIT 1
      ) sd ON true
      LEFT JOIN LATERAL (
        SELECT close_price
        FROM stock_data
        WHERE company_id = c.id
        ORDER BY date DESC
        OFFSET 1
        LIMIT 1
      ) prev ON true
      ORDER BY c.market_cap DESC NULLS LAST
    `);

    const summary = result.rows.map((row) => {
      const currentPrice = row.current_price
        ? parseFloat(row.current_price)
        : null;
      const prevPrice = row.prev_price ? parseFloat(row.prev_price) : null;
      const change = currentPrice && prevPrice ? currentPrice - prevPrice : 0;
      const changePercent =
        prevPrice !== 0 && prevPrice ? (change / prevPrice) * 100 : 0;

      return {
        id: row.id,
        symbol: row.symbol,
        name: row.name,
        sector: row.sector,
        marketCap: row.market_cap ? parseInt(row.market_cap) : null,
        currentPrice,
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        volume: row.volume ? parseInt(row.volume) : null,
        lastUpdate: row.date ? row.date.toISOString().split("T")[0] : null,
      };
    });

    res.json(summary);
  } catch (error) {
    console.error("Error fetching market summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get sector performance
router.get("/sectors", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.sector,
        COUNT(c.id) as company_count,
        AVG(sd.close_price) as avg_price,
        SUM(c.market_cap) as total_market_cap
      FROM companies c
      LEFT JOIN LATERAL (
        SELECT close_price
        FROM stock_data
        WHERE company_id = c.id
        ORDER BY date DESC
        LIMIT 1
      ) sd ON true
      GROUP BY c.sector
      ORDER BY total_market_cap DESC NULLS LAST
    `);

    const sectors = result.rows.map((row) => ({
      sector: row.sector,
      companyCount: parseInt(row.company_count),
      averagePrice: row.avg_price
        ? parseFloat(parseFloat(row.avg_price).toFixed(2))
        : null,
      totalMarketCap: row.total_market_cap
        ? parseInt(row.total_market_cap)
        : null,
    }));

    res.json(sectors);
  } catch (error) {
    console.error("Error fetching sector data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
