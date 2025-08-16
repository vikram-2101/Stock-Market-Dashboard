const { Pool } = require("pg");
require("dotenv").config();

const isCloud = !!process.env.DATABASE_URL;

const pool = new Pool(
  isCloud
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER || "postgres",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_NAME || "stockmarket",
        password: process.env.DB_PASSWORD || "password",
        port: process.env.DB_PORT || 5432,
      }
);

const setupDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log("🔄 Setting up database...");

    // Only try CREATE DATABASE locally
    if (!isCloud) {
      const dbName = process.env.DB_NAME || "stockmarket";
      const result = await client.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [dbName]
      );

      if (result.rows.length === 0) {
        console.log(`📊 Creating database: ${dbName}`);
        await client.query(`CREATE DATABASE ${dbName}`);
      } else {
        console.log(`✅ Database ${dbName} already exists`);
      }
    }

    // Create tables in the current DB
    console.log("🏗️  Creating tables...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        symbol VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        sector VARCHAR(100) NOT NULL,
        exchange VARCHAR(10) DEFAULT 'NSE',
        market_cap BIGINT,
        description TEXT,
        website VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS stock_data (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        open_price DECIMAL(10,2) NOT NULL,
        high_price DECIMAL(10,2) NOT NULL,
        low_price DECIMAL(10,2) NOT NULL,
        close_price DECIMAL(10,2) NOT NULL,
        adj_close_price DECIMAL(10,2),
        volume BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(company_id, date)
      )
    `);

    console.log("📈 Inserting sample companies...");
    // Insert sample companies
    const companies = [
      {
        symbol: "RELIANCE.NS",
        name: "Reliance Industries Ltd.",
        sector: "Energy",
        market_cap: 1800000000000, // 18 Lakh Crores
        description:
          "Reliance Industries Limited is an Indian multinational conglomerate, headquartered in Mumbai, Maharashtra, India.",
        website: "https://www.ril.com",
      },
      {
        symbol: "TCS.NS",
        name: "Tata Consultancy Services",
        sector: "IT",
        market_cap: 1300000000000,
        description:
          "Tata Consultancy Services is an Indian multinational information technology services and consulting company.",
        website: "https://www.tcs.com",
      },
      {
        symbol: "HDFCBANK.NS",
        name: "HDFC Bank Limited",
        sector: "Banking",
        market_cap: 900000000000,
        description:
          "HDFC Bank Limited is an Indian banking and financial services company.",
        website: "https://www.hdfcbank.com",
      },
      {
        symbol: "INFY.NS",
        name: "Infosys Limited",
        sector: "IT",
        market_cap: 700000000000,
        description:
          "Infosys Limited is an Indian multinational information technology company.",
        website: "https://www.infosys.com",
      },
      {
        symbol: "ICICIBANK.NS",
        name: "ICICI Bank Limited",
        sector: "Banking",
        market_cap: 650000000000,
        description:
          "ICICI Bank Limited is an Indian multinational bank and financial services company.",
        website: "https://www.icicibank.com",
      },
      {
        symbol: "HINDUNILVR.NS",
        name: "Hindustan Unilever Ltd.",
        sector: "FMCG",
        market_cap: 600000000000,
        description:
          "Hindustan Unilever Limited is an Indian consumer goods company.",
        website: "https://www.hul.co.in",
      },
      {
        symbol: "ITC.NS",
        name: "ITC Limited",
        sector: "FMCG",
        market_cap: 550000000000,
        description:
          "ITC Limited is an Indian conglomerate company headquartered in Kolkata, West Bengal.",
        website: "https://www.itcportal.com",
      },
      {
        symbol: "SBIN.NS",
        name: "State Bank of India",
        sector: "Banking",
        market_cap: 500000000000,
        description:
          "State Bank of India is an Indian multinational public sector bank.",
        website: "https://www.sbi.co.in",
      },
      {
        symbol: "BHARTIARTL.NS",
        name: "Bharti Airtel Limited",
        sector: "Telecom",
        market_cap: 450000000000,
        description:
          "Bharti Airtel Limited is an Indian multinational telecommunications services company.",
        website: "https://www.airtel.in",
      },
      {
        symbol: "ASIANPAINT.NS",
        name: "Asian Paints Limited",
        sector: "Paints",
        market_cap: 300000000000,
        description:
          "Asian Paints Limited is an Indian multinational paint company.",
        website: "https://www.asianpaints.com",
      },
      {
        symbol: "MARUTI.NS",
        name: "Maruti Suzuki India Ltd.",
        sector: "Automotive",
        market_cap: 280000000000,
        description:
          "Maruti Suzuki India Limited is an Indian automobile manufacturer.",
        website: "https://www.marutisuzuki.com",
      },
      {
        symbol: "BAJFINANCE.NS",
        name: "Bajaj Finance Limited",
        sector: "Finance",
        market_cap: 400000000000,
        description:
          "Bajaj Finance Limited is an Indian non-banking financial company.",
        website: "https://www.bajajfinserv.in",
      },
    ];

    for (const company of companies) {
      await client.query(
        `
        INSERT INTO companies (symbol, name, sector, market_cap, description, website) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        ON CONFLICT (symbol) DO NOTHING
      `,
        [
          company.symbol,
          company.name,
          company.sector,
          company.market_cap,
          company.description,
          company.website,
        ]
      );
    }

    console.log("📊 Generating sample stock data...");

    // Generate sample stock data for the last 90 days
    const generateStockData = async (companyId, symbol, basePrice) => {
      let currentPrice = basePrice;
      const days = 90;

      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        // Generate realistic OHLC data with some volatility
        const changePercent = (Math.random() - 0.5) * 0.06; // ±3% daily change
        const open = currentPrice;
        const close = open * (1 + changePercent);

        const dailyVolatility = 0.02; // 2% intraday volatility
        const high =
          Math.max(open, close) * (1 + Math.random() * dailyVolatility);
        const low =
          Math.min(open, close) * (1 - Math.random() * dailyVolatility);

        // Volume correlated with price movement (higher volume on bigger moves)
        const baseVolume = 100000 + Math.random() * 500000;
        const volume = Math.floor(
          baseVolume * (1 + Math.abs(changePercent) * 10)
        );

        try {
          await client.query(
            `
            INSERT INTO stock_data (company_id, date, open_price, high_price, low_price, close_price, adj_close_price, volume)
            VALUES ($1, $2, $3, $4, $5, $6, $6, $7)
            ON CONFLICT (company_id, date) DO NOTHING
          `,
            [
              companyId,
              date.toISOString().split("T")[0],
              parseFloat(open.toFixed(2)),
              parseFloat(high.toFixed(2)),
              parseFloat(low.toFixed(2)),
              parseFloat(close.toFixed(2)),
              volume,
            ]
          );
        } catch (err) {
          console.log(
            `⚠️  Skipping duplicate data for ${symbol} on ${
              date.toISOString().split("T")[0]
            }`
          );
        }

        currentPrice = close;
      }
    };

    // Get all companies and generate data
    const companiesResult = await client.query(
      "SELECT id, symbol FROM companies"
    );
    const basePrices = {
      "RELIANCE.NS": 2400,
      "TCS.NS": 3200,
      "HDFCBANK.NS": 1600,
      "INFY.NS": 1400,
      "ICICIBANK.NS": 900,
      "HINDUNILVR.NS": 2600,
      "ITC.NS": 450,
      "SBIN.NS": 550,
      "BHARTIARTL.NS": 800,
      "ASIANPAINT.NS": 3100,
      "MARUTI.NS": 9500,
      "BAJFINANCE.NS": 6800,
    };

    for (const company of companiesResult.rows) {
      const basePrice = basePrices[company.symbol] || 1000;
      await generateStockData(company.id, company.symbol, basePrice);
      console.log(`✅ Generated data for ${company.symbol}`);
    }

    client.release();

    console.log("🎉 Database setup completed successfully!");
    console.log("📊 Sample data has been inserted");
    console.log("🚀 You can now start the server with: npm start");
  } catch (err) {
    console.error("❌ Database setup failed:", err);
  } finally {
    client.release();
    await pool.end();
  }
};

if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log("✅ Setup completed successfully");
      process.exit(0);
    })
    .catch(() => process.exit(1));
}

module.exports = { setupDatabase };
