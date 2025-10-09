// frontend/src/components/StockDashboard.js
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  DollarSign,
  Users,
  Eye,
  RefreshCw,
  Filter,
  Download,
  Bell,
  Star,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import {
  useCompanies,
  useStockData,
  useRealTimePrice,
} from "../hooks/useStockData";
import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatDate,
  formatPriceChange,
} from "../utils/formatters";

const StockDashboard = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const [chartType, setChartType] = useState("line");
  const [dashboardView, setDashboardView] = useState("overview"); // overview, detailed, comparison
  const [watchlist, setWatchlist] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { companies, loading: companiesLoading } = useCompanies();
  const { stockData, loading: stockLoading } = useStockData(
    selectedCompany?.id,
    selectedTimeframe === "7d" ? 7 : selectedTimeframe === "30d" ? 30 : 90
  );
  const { price: realTimePrice, connected } = useRealTimePrice(
    selectedCompany?.id
  );

  // Auto-select first company when loaded
  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0]);
    }
  }, [companies, selectedCompany]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  const toggleWatchlist = (company) => {
    setWatchlist((prev) => {
      const isInWatchlist = prev.some((item) => item.id === company.id);
      if (isInWatchlist) {
        return prev.filter((item) => item.id !== company.id);
      } else {
        return [...prev, company];
      }
    });
  };

  const getMarketSummary = () => {
    if (!companies.length) return null;

    const totalMarketCap = companies.reduce(
      (sum, company) => sum + (company.market_cap || 0),
      0
    );
    const gainers = companies.filter(
      (c) => c.current_price - c.previous_close > 0
    ).length;
    const losers = companies.filter(
      (c) => c.current_price - c.previous_close < 0
    ).length;
    const unchanged = companies.length - gainers - losers;

    return { totalMarketCap, gainers, losers, unchanged };
  };

  const marketSummary = getMarketSummary();

  if (companiesLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Dashboard Header */}
      <DashboardHeader
        selectedCompany={selectedCompany}
        connected={connected}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        dashboardView={dashboardView}
        onViewChange={setDashboardView}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {dashboardView === "overview" && (
          <OverviewDashboard
            companies={companies}
            selectedCompany={selectedCompany}
            onSelectCompany={setSelectedCompany}
            stockData={stockData}
            stockLoading={stockLoading}
            realTimePrice={realTimePrice}
            marketSummary={marketSummary}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
            chartType={chartType}
            onChartTypeChange={setChartType}
            timeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
          />
        )}

        {dashboardView === "detailed" && (
          <DetailedDashboard
            selectedCompany={selectedCompany}
            onSelectCompany={setSelectedCompany}
            companies={companies}
            stockData={stockData}
            stockLoading={stockLoading}
            realTimePrice={realTimePrice}
            timeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
            chartType={chartType}
            onChartTypeChange={setChartType}
          />
        )}
      </div>
    </div>
  );
};

// Dashboard Header Component
const DashboardHeader = ({
  selectedCompany,
  connected,
  onRefresh,
  refreshing,
  dashboardView,
  onViewChange,
}) => (
  <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-10 transition-colors duration-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          </div>

          {/* View Selector */}
          <div className="flex rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
            <button
              onClick={() => onViewChange("overview")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                dashboardView === "overview"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => onViewChange("detailed")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                dashboardView === "detailed"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              Detailed
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Real-time Status */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {connected ? "Live Data" : "Offline"}
            </span>
          </div>

          {/* Selected Company */}
          {selectedCompany && (
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
              {selectedCompany.symbol}
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  </header>
);

// Overview Dashboard Component
const OverviewDashboard = ({
  companies,
  selectedCompany,
  onSelectCompany,
  stockData,
  stockLoading,
  realTimePrice,
  marketSummary,
  watchlist,
  onToggleWatchlist,
  chartType,
  onChartTypeChange,
  timeframe,
  onTimeframeChange,
}) => (
  <div className="space-y-6">
    {/* Market Summary Cards */}
    {marketSummary && (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Market Cap"
          value={formatCurrency(marketSummary.totalMarketCap, {
            compact: true,
          })}
          icon={<DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          trend="neutral"
        />
        <MetricCard
          title="Gainers"
          value={marketSummary.gainers}
          icon={<TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />}
          trend="positive"
        />
        <MetricCard
          title="Losers"
          value={marketSummary.losers}
          icon={<TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />}
          trend="negative"
        />
        <MetricCard
          title="Unchanged"
          value={marketSummary.unchanged}
          icon={<Activity className="h-6 w-6 text-gray-600 dark:text-gray-400" />}
          trend="neutral"
        />
      </div>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Company List Panel */}
      <div className="lg:col-span-1">
        <CompanyListPanel
          companies={companies}
          selectedCompany={selectedCompany}
          onSelectCompany={onSelectCompany}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
        />
      </div>

      {/* Main Chart and Details */}
      <div className="lg:col-span-3 space-y-6">
        {selectedCompany ? (
          <>
            {/* Price Header */}
            <PriceHeader
              company={selectedCompany}
              realTimePrice={realTimePrice}
            />

            {/* Chart Controls */}
            <ChartControls
              chartType={chartType}
              onChartTypeChange={onChartTypeChange}
              timeframe={timeframe}
              onTimeframeChange={onTimeframeChange}
            />

            {/* Main Chart */}
            <MainChart
              stockData={stockData}
              loading={stockLoading}
              chartType={chartType}
              companyName={selectedCompany.name}
            />

            {/* Quick Stats */}
            <QuickStats company={selectedCompany} stockData={stockData} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  </div>
);

// Detailed Dashboard Component
const DetailedDashboard = ({
  selectedCompany,
  onSelectCompany,
  companies,
  stockData,
  stockLoading,
  realTimePrice,
  timeframe,
  onTimeframeChange,
  chartType,
  onChartTypeChange,
}) => (
  <div className="space-y-6">
    {/* Company Selector */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 transition-colors duration-200">
      <select
        value={selectedCompany?.id || ""}
        onChange={(e) => {
          const company = companies.find(
            (c) => c.id === parseInt(e.target.value)
          );
          onSelectCompany(company);
        }}
        className="w-full max-w-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select a company...</option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name} ({company.symbol})
          </option>
        ))}
      </select>
    </div>

    {selectedCompany && (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Company Info */}
        <div className="space-y-6">
          <CompanyInfoCard
            company={selectedCompany}
            realTimePrice={realTimePrice}
          />
          <TechnicalIndicators stockData={stockData} />
        </div>

        {/* Middle Column - Main Chart */}
        <div className="xl:col-span-2 space-y-6">
          <ChartControls
            chartType={chartType}
            onChartTypeChange={onChartTypeChange}
            timeframe={timeframe}
            onTimeframeChange={onTimeframeChange}
          />

          <MainChart
            stockData={stockData}
            loading={stockLoading}
            chartType={chartType}
            companyName={selectedCompany.name}
          />

          <VolumeChart stockData={stockData} loading={stockLoading} />
        </div>
      </div>
    )}
  </div>
);

// Supporting Components

const MetricCard = ({ title, value, icon, trend }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] hover:border-gray-300 dark:hover:border-gray-500">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p
          className={`text-2xl font-bold ${
            trend === "positive"
              ? "text-green-600 dark:text-green-400"
              : trend === "negative"
                ? "text-red-600 dark:text-red-400"
                : "text-gray-900 dark:text-white"
          }`}
        >
          {value}
        </p>
      </div>
      {icon}
    </div>
  </div>
);

const CompanyListPanel = ({
  companies,
  selectedCompany,
  onSelectCompany,
  watchlist,
  onToggleWatchlist,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-200">
    <div className="p-4 border-b dark:border-gray-600">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Companies</h3>
    </div>
    <div className="max-h-96 overflow-y-auto">
      {companies.slice(0, 10).map((company) => {
        const change = formatPriceChange(
          company.current_price,
          company.previous_close
        );
        return (
          <div
            key={company.id}
            onClick={() => onSelectCompany(company)}
            className={`p-3 border-b dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              selectedCompany?.id === company.id
                ? "bg-blue-50 dark:bg-blue-900/20 border-r-4 border-r-blue-600 dark:border-r-blue-400"
                : ""
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                {company.name}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchlist(company);
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-yellow-500"
              >
                <Star
                  className={`h-4 w-4 ${
                    watchlist.some((item) => item.id === company.id)
                      ? "fill-yellow-500 text-yellow-500"
                      : ""
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">{company.symbol}</span>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(company.current_price)}
                </div>
                <div
                  className={`text-xs ${change.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {change.percentage}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const PriceHeader = ({ company, realTimePrice }) => {
  const currentPrice = realTimePrice?.price || company.current_price;
  const change = formatPriceChange(currentPrice, company.previous_close);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 transition-colors duration-200">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{company.name}</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {company.symbol} • {company.sector}
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(currentPrice)}
          </div>
          <div
            className={`text-lg font-medium ${
              change.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {change.absolute} ({change.percentage})
          </div>
        </div>
      </div>
    </div>
  );
};

const ChartControls = ({
  chartType,
  onChartTypeChange,
  timeframe,
  onTimeframeChange,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 transition-colors duration-200">
    <div className="flex items-center justify-between">
      <div className="flex space-x-2">
        {["line", "area", "candlestick"].map((type) => (
          <button
            key={type}
            onClick={() => onChartTypeChange(type)}
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
              chartType === type
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex space-x-2">
        {["7d", "30d", "90d"].map((period) => (
          <button
            key={period}
            onClick={() => onTimeframeChange(period)}
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
              timeframe === period
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const MainChart = ({ stockData, loading, chartType, companyName }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 transition-colors duration-200">
        <div className="animate-pulse">
          <div className="h-80 bg-gray-200 dark:bg-gray-600 rounded" />
        </div>
      </div>
    );
  }

  if (!stockData || stockData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 transition-colors duration-200">
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">No chart data available</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = stockData.map((item) => ({
    date: new Date(item.date).getTime(),
    dateString: formatDate(item.date),
    price: item.close,
    high: item.high,
    low: item.low,
    open: item.open,
    volume: item.volume,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border dark:border-gray-600 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {formatDate(new Date(label))}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Price:</span>{" "}
              {formatCurrency(data.price)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">High:</span>{" "}
              {formatCurrency(data.high)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Low:</span>{" "}
              {formatCurrency(data.low)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Volume:</span>{" "}
              {formatNumber(data.volume)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-200">
      <div className="p-4 border-b dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {companyName} Price Chart
        </h3>
      </div>
      <div className="p-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  type="number"
                  scale="time"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={(value) =>
                    formatDate(new Date(value), { short: true })
                  }
                />
                <YAxis
                  domain={["dataMin - 10", "dataMax + 10"]}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            ) : (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  type="number"
                  scale="time"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={(value) =>
                    formatDate(new Date(value), { short: true })
                  }
                />
                <YAxis
                  domain={["dataMin - 10", "dataMax + 10"]}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const QuickStats = ({ company, stockData }) => {
  if (!stockData || stockData.length === 0) return null;

  const high = Math.max(...stockData.map((d) => d.high));
  const low = Math.min(...stockData.map((d) => d.low));
  const avgVolume =
    stockData.reduce((sum, d) => sum + d.volume, 0) / stockData.length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 transition-colors duration-200">
        <p className="text-sm text-gray-600 dark:text-gray-400">Day High</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {formatCurrency(high)}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 transition-colors duration-200">
        <p className="text-sm text-gray-600 dark:text-gray-400">Day Low</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {formatCurrency(low)}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 transition-colors duration-200">
        <p className="text-sm text-gray-600 dark:text-gray-400">Avg Volume</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {formatNumber(avgVolume, { compact: true })}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 transition-colors duration-200">
        <p className="text-sm text-gray-600 dark:text-gray-400">Market Cap</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {formatCurrency(company.market_cap, { compact: true })}
        </p>
      </div>
    </div>
  );
};

const CompanyInfoCard = ({ company, realTimePrice }) => {
  const currentPrice = realTimePrice?.price || company.current_price;
  const change = formatPriceChange(currentPrice, company.previous_close);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 transition-colors duration-200">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Company Information
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Current Price</span>
          <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(currentPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Change</span>
          <span
            className={`font-semibold ${change.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {change.absolute} ({change.percentage})
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Market Cap</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(company.market_cap, { compact: true })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Sector</span>
          <span className="font-semibold text-gray-900 dark:text-white">{company.sector}</span>
        </div>
        {company.pe_ratio && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">P/E Ratio</span>
            <span className="font-semibold text-gray-900 dark:text-white">{company.pe_ratio.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const TechnicalIndicators = ({ stockData }) => {
  if (!stockData || stockData.length < 20) return null;

  // Simple moving averages
  const prices = stockData.map((d) => d.close);
  const sma20 = prices.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const sma50 =
    stockData.length >= 50
      ? prices.slice(-50).reduce((a, b) => a + b, 0) / 50
      : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 transition-colors duration-200">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Technical Indicators
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">SMA (20)</span>
          <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(sma20)}</span>
        </div>
        {sma50 && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">SMA (50)</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(sma50)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">RSI</span>
          <span className="font-semibold text-gray-900 dark:text-white">--</span>
        </div>
      </div>
    </div>
  );
};

const VolumeChart = ({ stockData, loading }) => {
  if (loading || !stockData || stockData.length === 0) return null;

  const volumeData = stockData.map((item) => ({
    date: new Date(item.date).getTime(),
    volume: item.volume,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-200">
      <div className="p-4 border-b dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Volume</h3>
      </div>
      <div className="p-4">
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                type="number"
                scale="time"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(value) =>
                  formatDate(new Date(value), { short: true })
                }
              />
              <YAxis
                tickFormatter={(value) =>
                  formatNumber(value, { compact: true })
                }
              />
              <Tooltip
                formatter={(value) => [formatNumber(value), "Volume"]}
                labelFormatter={(value) => formatDate(new Date(value))}
              />
              <Bar dataKey="volume" fill="#8884d8" opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-12 text-center transition-colors duration-200">
    <BarChart3 className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a Company</h3>
    <p className="text-gray-600 dark:text-gray-400">
      Choose a company from the list to view detailed stock information and
      interactive charts
    </p>
  </div>
);

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
            <div className="w-48 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
          </div>
          <div className="w-32 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
            <div className="w-full h-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="p-4 border-b dark:border-gray-600">
              <div className="w-24 h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
            </div>
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <div className="w-full h-80 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default StockDashboard;
