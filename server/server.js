// server.js - Node.js Express Server with PostgreSQL
const express = require("express");
const cors = require("cors");
// const { Pool } = require("pg");
const pool = require("./config/database");
require("dotenv").config();
const { setupDatabase } = require("./scripts/setupDatabase");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
// Get all companies

// app.use("/api/companies", companies);
// app.use("api/companies", stocks);
app.get("/api/companies", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, symbol, name, sector, exchange
      FROM companies
      ORDER BY name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get company by ID
app.get("/api/companies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT id, symbol, name, sector, exchange
      FROM companies
      WHERE id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get stock data for a company
app.get("/api/companies/:id/stock-data", async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;

    const result = await pool.query(
      `
      SELECT date, open_price, high_price, low_price, close_price, volume
      FROM stock_data 
      WHERE company_id = $1 
      ORDER BY date DESC 
      LIMIT $2
    `,
      [id, parseInt(days)]
    );

    // Reverse to get chronological order
    const stockData = result.rows.reverse().map((row) => ({
      date: row.date.toISOString().split("T")[0],
      open: parseFloat(row.open_price),
      high: parseFloat(row.high_price),
      low: parseFloat(row.low_price),
      close: parseFloat(row.close_price),
      volume: parseInt(row.volume),
    }));

    res.json(stockData);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get latest price for a company
app.get("/api/companies/:id/latest-price", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT close_price, date, volume
      FROM stock_data 
      WHERE company_id = $1 
      ORDER BY date DESC 
      LIMIT 1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No stock data found" });
    }

    const latestData = result.rows[0];
    res.json({
      price: parseFloat(latestData.close_price),
      date: latestData.date.toISOString().split("T")[0],
      volume: parseInt(latestData.volume),
    });
  } catch (error) {
    console.error("Error fetching latest price:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add new stock data (POST endpoint for data updates)
app.post("/api/companies/:id/stock-data", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, open, high, low, close, volume } = req.body;

    const result = await pool.query(
      `
      INSERT INTO stock_data (company_id, date, open_price, high_price, low_price, close_price, volume)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (company_id, date) 
      DO UPDATE SET 
        open_price = EXCLUDED.open_price,
        high_price = EXCLUDED.high_price,
        low_price = EXCLUDED.low_price,
        close_price = EXCLUDED.close_price,
        volume = EXCLUDED.volume
      RETURNING *
    `,
      [id, date, open, high, low, close, volume]
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

// Search companies
app.get("/api/search/companies", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Search query required" });
    }

    const result = await pool.query(
      `
      SELECT id, symbol, name, sector, exchange 
      FROM companies 
      WHERE name ILIKE $1 OR symbol ILIKE $1 OR sector ILIKE $1
      ORDER BY name
    `,
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error searching companies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get market summary
app.get("/api/market-summary", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.symbol,
        c.name,
        c.sector,
        sd.close_price as current_price,
        sd.volume,
        sd.date
      FROM companies c
      LEFT JOIN LATERAL (
        SELECT close_price, volume, date
        FROM stock_data
        WHERE company_id = c.id
        ORDER BY date DESC
        LIMIT 1
      ) sd ON true
      ORDER BY c.name
    `);

    const summary = result.rows.map((row) => ({
      id: row.id,
      symbol: row.symbol,
      name: row.name,
      sector: row.sector,
      currentPrice: row.current_price ? parseFloat(row.current_price) : null,
      volume: row.volume ? parseInt(row.volume) : null,
      lastUpdate: row.date ? row.date.toISOString().split("T")[0] : null,
    }));

    res.json(summary);
  } catch (error) {
    console.error("Error fetching market summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "healthy", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "unhealthy", database: "disconnected" });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start server
const startServer = async () => {
  try {
    await setupDatabase();
    //await seedStockData();

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(
        `🚀 API endpoints available at https://stock-market-dashboard-l9mv.onrender.com/api`
      );
      console.log(`📊 Database: PostgreSQL connected`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🔄 Shutting down server...");
  await pool.end();
  console.log("✅ Database connections closed");
  process.exit(0);
});
