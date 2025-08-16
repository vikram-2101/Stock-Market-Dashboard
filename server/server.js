// server.js - Node.js Express Server with PostgreSQL
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();
const { setupDatabase } = require("./scripts/setupDatabase");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "stockmarket",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,
});
// API Routes
const companies = require("./routes/companies");
const stocks = require("./routes/stocks");
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
      console.log(`🚀 API endpoints available at http://localhost:${PORT}/api`);
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

// // PostgreSQL connection

// // Database initialization
// const initDatabase = async () => {
//   try {
//     // Create companies table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS companies (
//         id SERIAL PRIMARY KEY,
//         symbol VARCHAR(20) UNIQUE NOT NULL,
//         name VARCHAR(255) NOT NULL,
//         sector VARCHAR(100) NOT NULL,
//         exchange VARCHAR(10) DEFAULT 'NSE',
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     // Create stock_data table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS stock_data (
//         id SERIAL PRIMARY KEY,
//         company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
//         date DATE NOT NULL,
//         open_price DECIMAL(10,2) NOT NULL,
//         high_price DECIMAL(10,2) NOT NULL,
//         low_price DECIMAL(10,2) NOT NULL,
//         close_price DECIMAL(10,2) NOT NULL,
//         volume BIGINT NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(company_id, date)
//       )
//     `);

//     // Insert sample companies
//     const companies = [
//       {
//         symbol: "RELIANCE.NS",
//         name: "Reliance Industries Ltd.",
//         sector: "Energy",
//       },
//       { symbol: "TCS.NS", name: "Tata Consultancy Services", sector: "IT" },
//       { symbol: "HDFCBANK.NS", name: "HDFC Bank Limited", sector: "Banking" },
//       { symbol: "INFY.NS", name: "Infosys Limited", sector: "IT" },
//       { symbol: "ICICIBANK.NS", name: "ICICI Bank Limited", sector: "Banking" },
//       {
//         symbol: "HINDUNILVR.NS",
//         name: "Hindustan Unilever Ltd.",
//         sector: "FMCG",
//       },
//       { symbol: "ITC.NS", name: "ITC Limited", sector: "FMCG" },
//       { symbol: "SBIN.NS", name: "State Bank of India", sector: "Banking" },
//       {
//         symbol: "BHARTIARTL.NS",
//         name: "Bharti Airtel Limited",
//         sector: "Telecom",
//       },
//       {
//         symbol: "ASIANPAINT.NS",
//         name: "Asian Paints Limited",
//         sector: "Paints",
//       },
//       {
//         symbol: "MARUTI.NS",
//         name: "Maruti Suzuki India Ltd.",
//         sector: "Automotive",
//       },
//       {
//         symbol: "BAJFINANCE.NS",
//         name: "Bajaj Finance Limited",
//         sector: "Finance",
//       },
//     ];

//     for (const company of companies) {
//       await pool.query(
//         `
//         INSERT INTO companies (symbol, name, sector)
//         VALUES ($1, $2, $3)
//         ON CONFLICT (symbol) DO NOTHING
//       `,
//         [company.symbol, company.name, company.sector]
//       );
//     }

//     console.log("Database initialized successfully");
//   } catch (error) {
//     console.error("Database initialization error:", error);
//   }
// };

// Helper function to generate sample stock data

// const generateSampleData = (basePrice, days = 30) => {
//   const data = [];
//   let currentPrice = basePrice;

//   for (let i = days; i >= 0; i--) {
//     const date = new Date();
//     date.setDate(date.getDate() - i);

//     // Generate realistic OHLC data
//     const changePercent = (Math.random() - 0.5) * 0.08; // ±4% change
//     const open = currentPrice;
//     const close = open * (1 + changePercent);
//     const high = Math.max(open, close) * (1 + Math.random() * 0.03);
//     const low = Math.min(open, close) * (1 - Math.random() * 0.03);
//     const volume = Math.floor(Math.random() * 1000000) + 100000;

//     data.push({
//       date: date.toISOString().split("T")[0],
//       open_price: parseFloat(open.toFixed(2)),
//       high_price: parseFloat(high.toFixed(2)),
//       low_price: parseFloat(low.toFixed(2)),
//       close_price: parseFloat(close.toFixed(2)),
//       volume,
//     });

//     currentPrice = close;
//   }

//   return data;
// };

// // Seed sample stock data
// const seedStockData = async () => {
//   try {
//     const companies = await pool.query("SELECT id, symbol FROM companies");
//     const basePrices = {
//       "RELIANCE.NS": 2400,
//       "TCS.NS": 3200,
//       "HDFCBANK.NS": 1600,
//       "INFY.NS": 1400,
//       "ICICIBANK.NS": 900,
//       "HINDUNILVR.NS": 2600,
//       "ITC.NS": 450,
//       "SBIN.NS": 550,
//       "BHARTIARTL.NS": 800,
//       "ASIANPAINT.NS": 3100,
//       "MARUTI.NS": 9500,
//       "BAJFINANCE.NS": 6800,
//     };

//     for (const company of companies.rows) {
//       const basePrice = basePrices[company.symbol] || 1000;
//       const stockData = generateSampleData(basePrice);

//       for (const data of stockData) {
//         await pool.query(
//           `
//           INSERT INTO stock_data (company_id, date, open_price, high_price, low_price, close_price, volume)
//           VALUES ($1, $2, $3, $4, $5, $6, $7)
//           ON CONFLICT (company_id, date) DO NOTHING
//         `,
//           [
//             company.id,
//             data.date,
//             data.open_price,
//             data.high_price,
//             data.low_price,
//             data.close_price,
//             data.volume,
//           ]
//         );
//       }
//     }

//     console.log("Sample stock data seeded successfully");
//   } catch (error) {
//     console.error("Error seeding stock data:", error);
//   }
// };
