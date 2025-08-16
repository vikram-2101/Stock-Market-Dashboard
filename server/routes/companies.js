const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Get all companies
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, symbol, name, sector, exchange, market_cap, description, website
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
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT id, symbol, name, sector, exchange, market_cap, description, website
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

// Search companies
router.get("/search/query", async (req, res) => {
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

module.exports = router;
