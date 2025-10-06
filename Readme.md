<p align="center">
  <img src="./assets/hacktoberfest_banner.jpeg" alt="Hacktoberfest 2025 Banner" width="100%" />
</p>

# Stock Dashboard Frontend

***

### 💖 Hacktoberfest 2025

<p align="center">
  <img src="https://img.shields.io/badge/Hacktoberfest-2025-blueviolet?style=for-the-badge&logo=github" />
  <img src="https://img.shields.io/badge/Contributions-Welcome-brightgreen?style=for-the-badge&logo=git" />
  <img src="https://img.shields.io/github/license/vikram-2101/Stock-Market-Dashboard?style=for-the-badge" />
</p>

This repository is participating in Hacktoberfest 2025! We welcome and encourage new contributors to help us improve this project.

* **Find an Issue:** Look for issues with the **`hacktoberfest`** and **`good first issue`** labels to get started.
* **Contribute:** Read our [CONTRIBUTING.md](CONTRIBUTING.md) guide for instructions on how to set up the project, make changes, and submit a pull request.
* **Join our Community:** Please review our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) to ensure a positive and inclusive environment for everyone.

***


A modern React-based web application for tracking Indian stock market data in real-time. This frontend provides an intuitive interface for viewing market overviews, company details, stock charts, and top movers.

**🔗 Backend Integration**: This frontend works with a Node.js/Express backend API using PostgreSQL database. See [Backend README](../backend/README.md) for complete backend setup instructions.

## 🏗️ System Architecture

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │ ◄─────────────────► │ Node.js Backend │ ◄──► │   PostgreSQL    │
│   (Port: 5173)   │                     │  (Port: 5000)   │    │   Database      │
└─────────────────┘                     └─────────────────┘    └─────────────────┘
```

## 🚀 Features

### 📊 Market Overview
- Real-time market indices (NIFTY 50, SENSEX, BANK NIFTY)
- Market statistics (gainers, losers, unchanged stocks)
- Visual indicators with trend arrows
- Live percentage changes with color coding

### 📈 Interactive Stock Charts
- Dynamic time range selection (1W, 1M, 3M, 6M, 1Y)
- Responsive line charts with hover tooltips
- Real-time price data visualization
- Clean and modern chart interface using Recharts

### 🏢 Company Management
- Comprehensive company listings
- Advanced search functionality
- Real-time stock prices and changes
- Market capitalization display
- Click-to-select company details

### 📋 Company Details Panel
- Complete financial metrics
- Current price, P/E ratio, dividend yield
- 52-week high/low tracking
- Volume and market cap information
- Company description and sector info

### 🔥 Top Movers Section
- Live top gainers and losers
- Quick access to high-performing stocks
- Real-time percentage changes
- One-click company selection

## 🛠️ Tech Stack

- **Build Tool**: Vite (modern build tool, faster than CRA)
- **Framework**: React 18.2.0
- **Charts**: Recharts 2.5.0
- **Icons**: Lucide React 0.263.1
- **Styling**: Tailwind CSS (utility-first)
- **HTTP Client**: Native Fetch API
- **State Management**: React Hooks (useState, useEffect)

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── CompanyList.jsx    # Company listing with search
│   │   ├── StockChart.jsx     # Interactive stock charts
│   │   ├── CompanyDetails.jsx # Company information panel
│   │   ├── StockDashboard.jsx # Main dashboard component
│   │   ├── MarketOverview.jsx # Market indices display
│   │   └── TopMovers.jsx      # Top gainers/losers
│   ├── hooks/               # Custom React hooks
│   │   └── useStockData.js  # Data fetching hooks
│   ├── services/            # API communication
│   │   └── api.js           # API service layer
│   ├── utils/               # Utility functions
│   │   └── formatters.js    # Data formatting helpers
│   ├── App.jsx              # Main application component
│   ├── index.css            # Global styles
│   └── main.jsx             # Application entry point (Vite)
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)  
- npm (v8.0.0 or higher)
- **Backend API server running on port 5000** (PostgreSQL-based)
- **PostgreSQL database** (v12 or higher) - handled by backend

### Backend Dependencies
Before running the frontend, ensure the backend is properly set up:

1. **PostgreSQL Database** with stock market data
2. **Node.js Backend API** running on port 5000
3. **Database Tables**: `companies` and `stock_data` with sample data

📋 **Backend Setup Required**: Follow the [Backend README](../backend/README.md) to set up the PostgreSQL database and API server first.

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stock-dashboard/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_NAME=Stock Dashboard
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:5173](http://localhost:5173) in your browser (Vite default port)

## 📜 Available Scripts

### Development
- `npm start` - Start development server with hot reload
- `npm test` - Run test suite in watch mode
- `npm run build` - Create optimized production build
- `npm run eject` - Eject from Create React App (⚠️ irreversible)

### Production
- `npm run build` - Build for production deployment
- `serve -s build` - Serve production build locally

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` | ✅ |
| `REACT_APP_NAME` | Application name | `Stock Dashboard` | ❌ |

### API Integration

The frontend communicates with the backend through RESTful APIs:

```javascript
// Example API usage
import apiService from './services/api';

// Fetch all companies
const companies = await apiService.getCompanies();

// Get stock data for specific timeframe
const stockData = await apiService.getStockData(companyId, 30);

// Search companies
const results = await apiService.searchCompanies('RELIANCE');
```

## 🎨 UI Components

### CompanyList
- **Purpose**: Display searchable list of companies
- **Features**: Real-time search, price display, selection state
- **Props**: `onCompanySelect`, `selectedCompanyId`

### StockChart
- **Purpose**: Render interactive stock price charts
- **Features**: Multiple timeframes, tooltips, responsive design
- **Props**: `companyId`, `companySymbol`

### CompanyDetails
- **Purpose**: Show comprehensive company information
- **Features**: Financial metrics, descriptions, formatted values
- **Props**: `company`

### TopMovers
- **Purpose**: Show top gaining and losing stocks
- **Features**: Real-time updates, quick selection, trend arrows
- **Props**: `companies`, `onCompanySelect`

### MarketOverview
- **Purpose**: Display market indices and statistics
- **Features**: Live data, trend indicators, statistics grid
- **Props**: None (uses hooks internally)

## 🎛️ Custom Hooks

### useStockData
```javascript
const { stockData, loading, error, refetch } = useStockData(companyId, days);
```
- Fetches historical stock data for charts
- Handles loading states and error management
- Auto-refetches when dependencies change

### useCompanies
```javascript
const { companies, loading, error, refetch } = useCompanies();
```
- Retrieves all company listings
- Provides search and filtering capabilities
- Manages company selection state

### useMarketSummary
```javascript
const { marketData, loading, error, refetch } = useMarketSummary();
```
- Fetches market indices and statistics
- Real-time market overview data
- Error handling for market data failures

## 🎯 Utility Functions

### formatters.js
- `formatPrice(price)` - Format currency in Indian Rupees
- `formatVolume(volume)` - Format volume with K, L, Cr suffixes
- `formatMarketCap(marketCap)` - Format market capitalization
- `formatPercentage(percentage)` - Format percentage with + sign
- `formatDate(dateString)` - Format dates for Indian locale

## 🎨 Styling Guide

The application uses Tailwind CSS for styling with a consistent design system:

### Color Palette
- **Primary Blue**: `bg-blue-600`, `text-blue-600`
- **Success Green**: `bg-green-600`, `text-green-600`
- **Error Red**: `bg-red-600`, `text-red-600`
- **Warning Yellow**: `bg-yellow-600`, `text-yellow-600`
- **Neutral Gray**: `bg-gray-50`, `text-gray-600`

### Component Classes
- Cards: `bg-white rounded-lg shadow-md p-6`
- Buttons: `px-3 py-2 rounded-md font-medium transition-colors`
- Input Fields: `px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2`

## 🚀 Performance Optimizations

### Code Splitting
- Automatic code splitting with Create React App
- Dynamic imports for heavy components
- Optimized bundle sizes

### Data Fetching
- Custom hooks for efficient API calls
- Error boundaries for graceful error handling
- Loading states for better user experience

### Rendering Optimizations
- React.memo for expensive components
- useCallback for stable function references
- Efficient re-rendering patterns

## 🔍 Troubleshooting

### Common Issues

**API Connection Failed**
```bash
# Check if backend is running
curl http://localhost:5000/api/companies

# Verify environment variables
echo $REACT_APP_API_URL
```

**Charts Not Rendering**
- Ensure Recharts is properly installed
- Check console for JavaScript errors
- Verify data format matches expected structure

**Search Not Working**
- Check network tab for API calls
- Verify search endpoint is accessible
- Ensure proper query parameter encoding

### Development Tips

1. **Hot Reload Issues**
   ```bash
   # Clear Vite cache
   npm run dev -- --force
   
   # Or delete .vite cache folder
   rm -rf node_modules/.vite
   ```

2. **Build Failures**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

**Search Not Working**

- Check network tab for API calls
- Verify search endpoint is accessible: `/api/search/companies?q=term`
- Ensure proper query parameter encoding
- Check if companies table has searchable data

3. **CORS Issues**
   - Ensure backend CORS is properly configured for PostgreSQL API
   - Check if Vite proxy is configured in vite.config.js
   - Verify API URL in environment variables
   - Backend should allow origin `http://localhost:5173`

### Backend Integration Tips

1. **Start Backend First**
   ```bash
   # In backend directory
   npm run dev  # Starts backend on port 5000
   ```

2. **Verify Backend Health**
   ```bash
   # Test backend connectivity
   curl http://localhost:5000/api/health
   curl http://localhost:5000/api/companies | jq
   ```

3. **Database Connection Issues**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql
   
   # Connect to database manually
   sudo -u postgres psql -d stockmarket
   
   # Verify tables exist
   \dt
   
   # Check sample data
   SELECT COUNT(*) FROM companies;
   SELECT COUNT(*) FROM stock_data;
   ```

## 🔄 State Management

The application uses React's built-in state management:

- **Local State**: Component-specific data with `useState`
- **Effect Hooks**: Side effects and API calls with `useEffect`
- **Custom Hooks**: Shared logic and data fetching
- **Prop Drilling**: Simple parent-child data flow

## 📱 Responsive Design

- **Mobile First**: Tailwind's responsive breakpoints
- **Grid Layouts**: CSS Grid for complex layouts
- **Flexible Charts**: Recharts ResponsiveContainer
- **Touch Friendly**: Proper touch targets and spacing

## 🧪 Testing Strategy

### Unit Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### Component Testing
- Test component rendering
- Verify user interactions
- Mock API calls for isolation

### Integration Testing
- Test component communication
- Verify data flow between components
- Test error handling scenarios

## 🚀 Deployment

### Production Build
```bash
# Create optimized build
npm run build

# Serve locally for testing
npx serve -s build
```

### Environment Setup
1. Set production API URL
2. Configure web server (Nginx/Apache)
3. Enable gzip compression
4. Set up SSL certificates

### Hosting Options
- **Netlify**: Automatic deployments from Git
- **Vercel**: Optimized for React applications
- **AWS S3**: Static website hosting
- **GitHub Pages**: Free hosting for public repos

## 📈 Performance Metrics

### Lighthouse Scores (Target)
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 90+

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style
- Use ESLint configuration
- Follow React best practices
- Maintain consistent formatting
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review troubleshooting section
- Contact the development team

---

**Built with ❤️ for the Indian Stock Market**
