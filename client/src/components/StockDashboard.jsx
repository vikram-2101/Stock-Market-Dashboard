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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
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
          icon={
            <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          }
          trend="neutral"
        />
        <MetricCard
          title="Gainers"
          value={marketSummary.gainers}
          icon={
            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
          }
          trend="positive"
        />
        <MetricCard
          title="Losers"
          value={marketSummary.losers}
          icon={
            <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
          }
          trend="negative"
        />
        <MetricCard
          title="Unchanged"
          value={marketSummary.unchanged}
          icon={
            <Activity className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          }
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

const MetricCard = ({ title, value, icon, trend }) => {
  const gradientClasses = React.useMemo(() => {
    switch (trend) {
      case "positive":
        return "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 border-green-200 dark:border-green-800 hover:shadow-green-200/50 dark:hover:shadow-green-900/30";
      case "negative":
        return "bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/30 border-red-200 dark:border-red-800 hover:shadow-red-200/50 dark:hover:shadow-red-900/30";
      default:
        return "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 border-blue-200 dark:border-blue-800 hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30";
    }
  }, [trend]);

  return (
    <div
      className={`${gradientClasses} rounded-lg shadow-lg border-2 p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] group cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">
            {title}
          </p>
          <p
            className={`text-2xl font-bold transition-all duration-300 ${
              trend === "positive"
                ? "text-green-700 dark:text-green-300 group-hover:text-green-600 dark:group-hover:text-green-200"
                : trend === "negative"
                  ? "text-red-700 dark:text-red-300 group-hover:text-red-600 dark:group-hover:text-red-200"
                  : "text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-100"
            }`}
          >
            {value}
          </p>
        </div>
        <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
          {icon}
        </div>
      </div>
    </div>
  );
};

const CompanyListPanel = ({
  companies,
  selectedCompany,
  onSelectCompany,
  watchlist,
  onToggleWatchlist,
}) => (
  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden">
    <div className="p-3 border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20">
      <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center">
        <BarChart3 className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
        Companies
      </h3>
    </div>
    <div className="max-h-96 overflow-y-auto custom-scrollbar">
      {companies.slice(0, 10).map((company) => {
        const change = formatPriceChange(
          company.current_price,
          company.previous_close
        );
        const isSelected = selectedCompany?.id === company.id;
        return (
          <div
            key={company.id}
            onClick={() => onSelectCompany(company)}
            className={`p-3 m-2 rounded-lg cursor-pointer transition-all duration-300 group ${
              isSelected
                ? "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 shadow-md border-2 border-blue-400 dark:border-blue-500"
                : "bg-white dark:bg-gray-800/50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-700/50 dark:hover:to-blue-900/20 hover:shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="font-medium text-sm text-gray-900 dark:text-white truncate flex-1 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                {company.name}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchlist(company);
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-yellow-500 transition-all duration-300 hover:scale-110 ml-2"
              >
                <Star
                  className={`h-3.5 w-3.5 transition-all duration-300 ${
                    watchlist.some((item) => item.id === company.id)
                      ? "fill-yellow-500 text-yellow-500"
                      : "hover:rotate-12"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                {company.symbol}
              </span>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
                  {formatCurrency(company.current_price)}
                </div>
                <div
                  className={`text-xs font-medium px-1.5 py-0.5 rounded whitespace-nowrap ${
                    change.isPositive
                      ? "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30"
                      : "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30"
                  }`}
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
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-blue-900/10 dark:to-purple-900/10 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 p-5 transition-all duration-300 hover:shadow-xl group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-700 dark:from-white dark:to-blue-300 mb-2 group-hover:scale-[1.01] transition-transform">
            {company.name}
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-2">
            <span className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded font-bold text-blue-700 dark:text-blue-300">
              {company.symbol}
            </span>
            <span className="text-gray-400">•</span>
            <span className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 px-2 py-0.5 rounded font-semibold text-purple-700 dark:text-purple-300">
              {company.sector}
            </span>
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-gray-900 dark:text-white mb-1.5 group-hover:scale-105 transition-transform">
            {formatCurrency(currentPrice)}
          </div>
          <div
            className={`text-base font-bold px-3 py-1.5 rounded-lg inline-block shadow-sm transition-all duration-300 group-hover:scale-105 ${
              change.isPositive
                ? "text-green-700 dark:text-green-200 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40"
                : "text-red-700 dark:text-red-200 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40"
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
  <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-700 p-3 transition-all duration-300 hover:shadow-lg">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg">
        {["line", "area", "candlestick"].map((type) => (
          <button
            key={type}
            onClick={() => onChartTypeChange(type)}
            className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-all duration-300 ${
              chartType === type
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-105"
                : "text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg">
        {["7d", "30d", "90d"].map((period) => (
          <button
            key={period}
            onClick={() => onTimeframeChange(period)}
            className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-all duration-300 ${
              timeframe === period
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md scale-105"
                : "text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm"
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
            <p className="text-gray-600 dark:text-gray-400">
              No chart data available
            </p>
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
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl overflow-hidden">
      <div className="p-3 border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-900/20 dark:to-indigo-900/20">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
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

  const statCards = React.useMemo(
    () => [
      {
        label: "Day High",
        value: formatCurrency(high),
        gradient:
          "from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30",
        border: "border-green-200 dark:border-green-800",
        icon: (
          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
        ),
      },
      {
        label: "Day Low",
        value: formatCurrency(low),
        gradient:
          "from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/30",
        border: "border-red-200 dark:border-red-800",
        icon: (
          <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
        ),
      },
      {
        label: "Avg Volume",
        value: formatNumber(avgVolume, { compact: true }),
        gradient:
          "from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30",
        border: "border-blue-200 dark:border-blue-800",
        icon: <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      },
      {
        label: "Market Cap",
        value: formatCurrency(company.market_cap, { compact: true }),
        gradient:
          "from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/30",
        border: "border-purple-200 dark:border-purple-800",
        icon: (
          <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        ),
      },
    ],
    [high, low, avgVolume, company.market_cap]
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${stat.gradient} rounded-lg shadow-md border-2 ${stat.border} p-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.02] group cursor-pointer`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              {stat.label}
            </p>
            <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              {stat.icon}
            </div>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

const CompanyInfoCard = ({ company, realTimePrice }) => {
  const currentPrice = realTimePrice?.price || company.current_price;
  const change = formatPriceChange(currentPrice, company.previous_close);

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-xl shadow-xl border-2 border-blue-200 dark:border-blue-800 p-6 transition-all duration-300 hover:shadow-2xl">
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-300 dark:to-purple-300 mb-5 flex items-center">
        <BarChart3 className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
        Company Information
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Current Price
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(currentPrice)}
          </span>
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
          <span className="font-semibold text-gray-900 dark:text-white">
            {company.sector}
          </span>
        </div>
        {company.pe_ratio && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">P/E Ratio</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {company.pe_ratio.toFixed(2)}
            </span>
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
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(sma20)}
          </span>
        </div>
        {sma50 && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">SMA (50)</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(sma50)}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">RSI</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            --
          </span>
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Volume
        </h3>
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
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
      Select a Company
    </h3>
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
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4"
          >
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
                <div
                  key={i}
                  className="w-full h-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"
                />
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
