import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Calendar, TrendingUp, BarChart3, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/formatters";

const StockChart = ({ stockData, loading, companyName }) => {
  const [chartType, setChartType] = useState("line");
  const [timeframe, setTimeframe] = useState("30d");

  const chartData =
    stockData?.map((item) => ({
      date: new Date(item.date).getTime(),
      dateString: formatDate(item.date),
      price: item.close,
      high: item.high,
      low: item.low,
      open: item.open,
      volume: item.volume,
    })) || [];

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
              {data.volume?.toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getChartColor = () => {
    if (chartData.length < 2) return "#3b82f6";
    const firstPrice = chartData[0].price;
    const lastPrice = chartData[chartData.length - 1].price;
    return lastPrice >= firstPrice ? "#10b981" : "#ef4444";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
      {/* Chart Header */}
      <div className="p-4 border-b dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {companyName} Stock Chart
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Chart Type Toggle */}
            <div className="flex rounded-lg border dark:border-gray-600">
              <button
                onClick={() => setChartType("line")}
                className={`px-3 py-1 text-sm font-medium rounded-l-lg transition-colors ${
                  chartType === "line"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType("area")}
                className={`px-3 py-1 text-sm font-medium rounded-r-lg border-l dark:border-gray-600 transition-colors ${
                  chartType === "area"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Area
              </button>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
                <option value="90d">90 Days</option>
                <option value="1y">1 Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-4">
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading chart data...</p>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">No chart data available</p>
            </div>
          </div>
        ) : (
          <>
            {/* Price Summary */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current: </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(chartData[chartData.length - 1]?.price)}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp
                    className={`h-4 w-4 ${
                      chartData[chartData.length - 1]?.price >=
                      chartData[0]?.price
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400 rotate-180"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      chartData[chartData.length - 1]?.price >=
                      chartData[0]?.price
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {(
                      (chartData[chartData.length - 1]?.price /
                        chartData[0]?.price -
                        1) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {chartData.length} data points
              </div>
            </div>

            {/* Chart */}
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
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      domain={["dataMin - 10", "dataMax + 10"]}
                      tickFormatter={(value) => `₹${value}`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={getChartColor()}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: getChartColor() }}
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
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      domain={["dataMin - 10", "dataMax + 10"]}
                      tickFormatter={(value) => `₹${value}`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={getChartColor()}
                      fill={getChartColor()}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Chart Statistics */}
            <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t dark:border-gray-600">
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">High</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(Math.max(...chartData.map((d) => d.high)))}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">Low</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(Math.min(...chartData.map((d) => d.low)))}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">Avg Volume</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {(
                    chartData.reduce((sum, d) => sum + d.volume, 0) /
                    chartData.length
                  ).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">Volatility</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {(
                    Math.max(...chartData.map((d) => d.high)) -
                    Math.min(...chartData.map((d) => d.low))
                  ).toFixed(2)}
                  %
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StockChart;
