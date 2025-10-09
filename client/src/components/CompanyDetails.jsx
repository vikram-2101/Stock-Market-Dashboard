import React from "react";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import { useRealTimePrice } from "../hooks/useStockData";

const CompanyDetails = ({ company, stockData }) => {
  const { priceData, loading: priceLoading } = useRealTimePrice(company?.id);

  if (!company) {
    return null;
  }

  const getCurrentPrice = () => {
    if (priceData) return priceData.price;
    if (stockData && stockData.length > 0) {
      return stockData[stockData.length - 1].close;
    }
    return 0;
  };

  const getPriceChange = () => {
    if (priceData) {
      return {
        change: priceData.change,
        percentage: priceData.changePercent,
      };
    }

    if (stockData && stockData.length >= 2) {
      const current = stockData[stockData.length - 1].close;
      const previous = stockData[stockData.length - 2].close;
      const change = current - previous;
      const percentage = (change / previous) * 100;
      return {
        change: parseFloat(change.toFixed(2)),
        percentage: parseFloat(percentage.toFixed(2)),
      };
    }

    return { change: 0, percentage: 0 };
  };

  const getSectorColor = (sector) => {
    const colors = {
      IT: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
      Banking: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
      Energy: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
      FMCG: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
      Telecom: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
      Paints: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
      Automotive: "bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-300",
      Finance: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300",
    };
    return colors[sector] || "bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-300";
  };

  const currentPrice = getCurrentPrice();
  const priceChange = getPriceChange();
  const isPositive = priceChange.change >= 0;
  const volume =
    priceData?.volume ||
    (stockData?.length > 0 ? stockData[stockData.length - 1].volume : 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 transition-colors duration-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{company.name}</h2>
          <p className="text-gray-600 dark:text-gray-300">{company.symbol}</p>
          {company.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
              {company.description}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSectorColor(
              company.sector
            )}`}
          >
            {company.sector}
          </span>
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-2"
            >
              Visit Website
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-1" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Current Price
            </span>
          </div>
          {priceLoading ? (
            <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-8 rounded"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹
              {currentPrice.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </p>
          )}
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 mr-1" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400 mr-1" />
            )}
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Change</span>
          </div>
          {priceLoading ? (
            <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-8 rounded"></div>
          ) : (
            <p
              className={`text-2xl font-bold ${
                isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {isPositive ? "+" : ""}₹{Math.abs(priceChange.change).toFixed(2)}
            </p>
          )}
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 mr-1" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400 mr-1" />
            )}
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Change %</span>
          </div>
          {priceLoading ? (
            <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-8 rounded"></div>
          ) : (
            <p
              className={`text-2xl font-bold ${
                isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {isPositive ? "+" : ""}
              {priceChange.percentage.toFixed(2)}%
            </p>
          )}
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-1" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Volume</span>
          </div>
          {priceLoading ? (
            <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-8 rounded"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {volume ? (volume / 1000).toFixed(0) + "K" : "N/A"}
            </p>
          )}
        </div>
      </div>

      {company.marketCap && (
        <div className="mt-4 pt-4 border-t dark:border-gray-600">
          <div className="text-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Market Cap
            </span>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ₹{(company.marketCap / 10000000).toFixed(0)} Crores
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
