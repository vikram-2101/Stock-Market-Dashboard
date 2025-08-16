// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const StockChart = ({ stockData, loading, companyName }) => {
//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm border p-6">
//         <div className="animate-pulse">
//           <div className="bg-gray-200 h-6 w-48 rounded mb-4"></div>
//           <div className="bg-gray-200 h-96 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!stockData || stockData.length === 0) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm border p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">
//           Stock Price Chart
//         </h3>
//         <div className="h-96 flex items-center justify-center text-gray-500">
//           No stock data available
//         </div>
//       </div>
//     );
//   }

//   const formatTooltipValue = (value, name) => {
//     if (name === "Stock Price") {
//       return [
//         `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
//         "Price",
//       ];
//     }
//     return [value, name];
//   };

//   const formatTooltipLabel = (label) => {
//     return new Date(label).toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border p-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">
//         {companyName ? `${companyName} - ` : ""}30-Day Price Chart
//       </h3>

//       <ResponsiveContainer width="100%" height={400}>
//         <LineChart data={stockData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis
//             dataKey="date"
//             tickFormatter={(value) =>
//               new Date(value).toLocaleDateString("en-IN", {
//                 month: "short",
//                 day: "numeric",
//               })
//             }
//           />
//           <YAxis
//             tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`}
//             domain={["dataMin * 0.95", "dataMax * 1.05"]}
//           />
//           <Tooltip
//             formatter={formatTooltipValue}
//             labelFormatter={formatTooltipLabel}
//           />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="close"
//             stroke="#2563eb"
//             strokeWidth={2}
//             dot={false}
//             name="Stock Price"
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default StockChart;
// frontend/src/components/StockChart.js
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
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">
            {formatDate(new Date(label))}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Price:</span>{" "}
              {formatCurrency(data.price)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">High:</span>{" "}
              {formatCurrency(data.high)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Low:</span>{" "}
              {formatCurrency(data.low)}
            </p>
            <p className="text-sm text-gray-600">
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
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Chart Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">
              {companyName} Stock Chart
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Chart Type Toggle */}
            <div className="flex rounded-lg border">
              <button
                onClick={() => setChartType("line")}
                className={`px-3 py-1 text-sm font-medium rounded-l-lg transition-colors ${
                  chartType === "line"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType("area")}
                className={`px-3 py-1 text-sm font-medium rounded-r-lg border-l transition-colors ${
                  chartType === "area"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Area
              </button>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              <p className="text-sm text-gray-600">Loading chart data...</p>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No chart data available</p>
            </div>
          </div>
        ) : (
          <>
            {/* Price Summary */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <span className="text-sm text-gray-600">Current: </span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(chartData[chartData.length - 1]?.price)}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp
                    className={`h-4 w-4 ${
                      chartData[chartData.length - 1]?.price >=
                      chartData[0]?.price
                        ? "text-green-600"
                        : "text-red-600 rotate-180"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      chartData[chartData.length - 1]?.price >=
                      chartData[0]?.price
                        ? "text-green-600"
                        : "text-red-600"
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
              <div className="text-xs text-gray-500">
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
            <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-xs text-gray-600">High</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(Math.max(...chartData.map((d) => d.high)))}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">Low</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(Math.min(...chartData.map((d) => d.low)))}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">Avg Volume</p>
                <p className="text-sm font-semibold text-gray-900">
                  {(
                    chartData.reduce((sum, d) => sum + d.volume, 0) /
                    chartData.length
                  ).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">Volatility</p>
                <p className="text-sm font-semibold text-gray-900">
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
