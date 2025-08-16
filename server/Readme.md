# Stock Market Dashboard - Backend API

A complete Node.js backend API with PostgreSQL database for the Stock Market Dashboard application.

## 🚀 Features

- **RESTful API** built with Express.js
- **PostgreSQL Database** with proper schema design
- **Real-time Stock Data** with OHLC (Open, High, Low, Close) pricing
- **Company Management** with sector classification
- **Historical Data** storage and retrieval
- **Search Functionality** for companies
- **Market Summary** endpoints
- **Database Migrations** and seeding scripts

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **PostgreSQL** (v12 or higher) installed and running

## 🛠️ Installation & Setup

### 1. Clone and Setup Project

```bash
# Create project directory
mkdir stock-market-backend
cd stock-market-backend

# Initialize npm project
npm init -y

# Install dependencies
npm install express pg cors dotenv helmet morgan
npm install -D nodemon jest supertest
```

### 2. Database Setup

```bash
# Start PostgreSQL service (Ubuntu/Debian)
sudo systemctl start postgresql

# Or for macOS with Homebrew
brew services start postgresql

# Create a database user (optional)
sudo -u postgres createuser --interactive
```

### 3. Environment Configuration

Create a `.env` file in your project root:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stockmarket
DB_USER=postgres
DB_PASSWORD=your_password_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Database Initialization

```bash
# Run the database setup script
npm run db:setup

# Or manually run:
node scripts/setupDatabase.js
```

### 5. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## 📚 API Endpoints

### Companies

| Method | Endpoint                       | Description       |
| ------ | ------------------------------ | ----------------- |
| GET    | `/api/companies`               | Get all companies |
| GET    | `/api/companies/:id`           | Get company by ID |
| GET    | `/api/search/companies?q=term` | Search companies  |

### Stock Data

| Method | Endpoint                                | Description                      |
| ------ | --------------------------------------- | -------------------------------- |
| GET    | `/api/companies/:id/stock-data`         | Get historical stock data        |
| GET    | `/api/companies/:id/stock-data?days=30` | Get stock data for specific days |
| GET    | `/api/companies/:id/latest-price`       | Get latest stock price           |
| POST   | `/api/companies/:id/stock-data`         | Add new stock data               |

### Market Data

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | `/api/market-summary` | Get market overview |
| GET    | `/api/health`         | Health check        |

## 📊 Database Schema

### Companies Table

```sql
CREATE TABLE companies (
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
);
```

### Stock Data Table

```sql
CREATE TABLE stock_data (
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
);
```

## 🔧 API Usage Examples

### Get All Companies

```bash
curl http://localhost:5000/api/companies
```

### Get Stock Data for a Company

```bash
curl http://localhost:5000/api/companies/1/stock-data?days=30
```

### Search Companies

```bash
curl http://localhost:5000/api/search/companies?q=reliance
```

### Add Stock Data

```bash
curl -X POST http://localhost:5000/api/companies/1/stock-data \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-08-10",
    "open": 2400.50,
    "high": 2450.75,
    "low": 2390.25,
    "close": 2435.60,
    "volume": 1250000
  }'
```

## 🧪 Testing

```bash
# Run tests
npm test

# Test API endpoints manually
curl http://localhost:5000/api/health
```

## 🌐 Integration with Frontend

Update your React frontend to use the backend API:

```javascript
// Example: Fetch companies from backend
const fetchCompanies = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/companies");
    const companies = await response.json();
    setCompanies(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
};

// Example: Fetch stock data
const fetchStockData = async (companyId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/companies/${companyId}/stock-data?days=30`
    );
    const stockData = await response.json();
    setStockData(stockData);
  } catch (error) {
    console.error("Error fetching stock data:", error);
  }
};
```

## 🔒 Security Features

- CORS configuration
- Helmet.js for security headers
- Input validation
- SQL injection prevention with parameterized queries
- Error handling middleware

## 📈 Sample Data

The setup script automatically creates:

- 12 major Indian companies (Reliance, TCS, HDFC Bank, etc.)
- 90 days of historical stock data
- Realistic OHLC pricing with volume data
- Proper sector classification

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2
3. Configure SSL/HTTPS
4. Set up database connection pooling
5. Enable logging and monitoring

```bash
# Using PM2
npm install -g pm2
pm2 start server.js --name "stock-api"
```

## 🔧 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check if database exists
sudo -u postgres psql -l
```

### Port Already in Use

```bash
# Kill process on port 5000
sudo lsof -ti:5000 | xargs kill -9
```

### Permission Issues

```bash
# Fix PostgreSQL permissions
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'newpassword';"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
