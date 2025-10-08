// frontend/src/App.js
import React, { useState } from "react";
import { BarChart3, AlertCircle } from "lucide-react";
import StockDashboard from "./components/StockDashboard";
import CompanyList from "./components/CompanyList";
import CompanyDetails from "./components/CompanyDetails";
import StockChart from "./components/StockChart";
import { useCompanies, useStockData } from "./hooks/useStockData";
import ThemeToggle from "./components/ThemeToggle";

const App = () => {
  const [currentView, setCurrentView] = useState("dashboard"); // 'dashboard', 'legacy'
  const [selectedCompany, setSelectedCompany] = useState(null);

  const {
    companies,
    loading: companiesLoading,
    error: companiesError,
  } = useCompanies();

  const {
    stockData,
    loading: stockLoading,
    error: stockError,
  } = useStockData(selectedCompany?.id, 30);

  // Set first company as selected when companies load (for legacy view)
  React.useEffect(() => {
    if (
      companies.length > 0 &&
      !selectedCompany &&
      currentView === "dashboard"
    ) {
      setSelectedCompany(companies[0]);
    }
  }, [companies, selectedCompany, currentView]);

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
  };

  // Error boundary for companies
  if (companiesError) {
    return <ErrorFallback error={companiesError} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">

<div className="flex items-center">
  <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
    <span className="mr-3">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10 text-blue-600 dark:text-blue-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1.286-1.286a.75.75 0 0 1 1.06-1.06l2.5 2.5a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 0 1-1.06-1.06L16.094 16.5H9.25Z" />
      </svg>
    </span>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
      Stock Market Dashboard
    </h1>
  </a>
</div>

            {/* View Toggle */}
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentView === "dashboard"
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView("legacy")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentView === "legacy"
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Classic View
                </button>
              </nav>

              <ThemeToggle />

              <div className="text-sm text-gray-500 dark:text-gray-400">NSE/BSE Market Data</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentView === "legacy" ? (
          // New Enhanced Dashboard
          <StockDashboard />
        ) : (
          // Legacy View (Original Layout)
          <LegacyView
            companies={companies}
            selectedCompany={selectedCompany}
            onSelectCompany={handleSelectCompany}
            companiesLoading={companiesLoading}
            stockData={stockData}
            stockLoading={stockLoading}
            stockError={stockError}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Stock Market Dashboard - Real-time NSE/BSE Data
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Built with React.js, Node.js & PostgreSQL
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Legacy View Component (Original Layout)
const LegacyView = ({
  companies,
  selectedCompany,
  onSelectCompany,
  companiesLoading,
  stockData,
  stockLoading,
  stockError,
}) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="flex gap-6">
      {/* Left Panel - Company List */}
      <CompanyList
        companies={companies}
        selectedCompany={selectedCompany}
        onSelectCompany={onSelectCompany}
        loading={companiesLoading}
      />

      {/* Right Panel - Company Details and Chart */}
      <div className="flex-1 space-y-6">
        {selectedCompany ? (
          <>
            {/* Company Details Card */}
            <CompanyDetails company={selectedCompany} stockData={stockData} />

            {/* Stock Chart */}
            <StockChart
              stockData={stockData}
              loading={stockLoading}
              companyName={selectedCompany.name}
            />

            {/* Error Display */}
            {stockError && <ErrorAlert error={stockError} />}
          </>
        ) : (
          <EmptyCompanyState />
        )}
      </div>
    </div>
  </div>
);

// Error Fallback Component
const ErrorFallback = ({ error }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto px-4">
      <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        We couldn't load the stock market data. Please check your connection and
        try again.
      </p>
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
        <div className="text-red-800 dark:text-red-300 text-sm font-medium">Error Details:</div>
        <div className="text-red-700 dark:text-red-400 text-sm mt-1">{error}</div>
      </div>
      <div className="space-x-4">
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  </div>
);

// Error Alert Component
const ErrorAlert = ({ error }) => (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
    <div className="flex items-start">
      <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
      <div>
        <div className="text-red-800 dark:text-red-300 font-medium text-sm">
          Error loading stock data
        </div>
        <div className="text-red-700 dark:text-red-400 text-sm mt-1">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="text-red-800 dark:text-red-300 text-sm font-medium hover:text-red-900 dark:hover:text-red-200 mt-2"
        >
          Try again →
        </button>
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyCompanyState = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-8 text-center transition-colors duration-200">
    <BarChart3 className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a Company</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">
      Choose a company from the list to view its stock data and charts
    </p>
    <div className="text-sm text-gray-500 dark:text-gray-400">
      💡 Tip: Use the search function to quickly find specific companies
    </div>
  </div>
);

export default App;
