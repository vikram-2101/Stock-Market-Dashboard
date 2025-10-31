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
      Banking:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
      Energy: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
      FMCG: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
      Telecom:
        "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
      Paints:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
      Automotive:
        "bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-300",
      Finance:
        "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300",
    };
    return (
      colors[sector] ||
      "bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-300"
    );
  };

  const currentPrice = getCurrentPrice();
  const priceChange = getPriceChange();
  const isPositive = priceChange.change >= 0;
  const volume =
    priceData?.volume ||
    (stockData?.length > 0 ? stockData[stockData.length - 1].volume : 0);

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 dark:from-gray-800 dark:via-blue-900/10 dark:to-purple-900/10 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-3xl group">
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-700 dark:from-white dark:to-blue-300 mb-3 group-hover:scale-[1.02] transition-transform">
            {company.name}
          </h2>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg inline-block mb-3">
            {company.symbol}
          </p>
          {company.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 max-w-2xl leading-relaxed">
              {company.description}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span
            className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-md ${getSectorColor(
              company.sector
            )} transition-all duration-300 hover:scale-105`}
          >
            {company.sector}
          </span>
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-3 px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
            >
              Visit Website →
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/40 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group/card">
          <div className="flex items-center justify-center mb-3">
            <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2 group-hover/card:scale-110 transition-transform" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Current Price
            </span>
          </div>
          {priceLoading ? (
            <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-8 rounded-lg"></div>
          ) : (
            <p className="text-2xl font-black text-gray-900 dark:text-white text-center group-hover/card:scale-105 transition-transform">
              ₹
              {currentPrice.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </p>
          )}
        </div>

        <div
          className={`bg-gradient-to-br ${isPositive ? "from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/40 border-green-200 dark:border-green-800" : "from-red-50 to-rose-100 dark:from-red-900/30 dark:to-rose-900/40 border-red-200 dark:border-red-800"} rounded-xl p-5 border-2 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group/card`}
        >
          <div className="flex items-center justify-center mb-3">
            {isPositive ? (
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400 mr-2 group-hover/card:scale-110 group-hover/card:rotate-12 transition-all" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400 mr-2 group-hover/card:scale-110 group-hover/card:rotate-12 transition-all" />
            )}
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Change
            </span>
          </div>
          {priceLoading ? (
            <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-8 rounded-lg"></div>
          ) : (
            <p
              className={`text-2xl font-black text-center group-hover/card:scale-105 transition-transform ${
                isPositive
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              }`}
            >
              {isPositive ? "+" : ""}₹{Math.abs(priceChange.change).toFixed(2)}
            </p>
          )}
        </div>

        <div
          className={`bg-gradient-to-br ${isPositive ? "from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/40 border-green-200 dark:border-green-800" : "from-red-50 to-rose-100 dark:from-red-900/30 dark:to-rose-900/40 border-red-200 dark:border-red-800"} rounded-xl p-5 border-2 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group/card`}
        >
          <div className="flex items-center justify-center mb-3">
            {isPositive ? (
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400 mr-2 group-hover/card:scale-110 group-hover/card:rotate-12 transition-all" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400 mr-2 group-hover/card:scale-110 group-hover/card:rotate-12 transition-all" />
            )}
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Change %
            </span>
          </div>
          {priceLoading ? (
            <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-8 rounded-lg"></div>
          ) : (
            <p
              className={`text-2xl font-black text-center group-hover/card:scale-105 transition-transform ${
                isPositive
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              }`}
            >
              {isPositive ? "+" : ""}
              {priceChange.percentage.toFixed(2)}%
            </p>
          )}
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/40 rounded-xl p-5 border-2 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group/card">
          <div className="flex items-center justify-center mb-3">
            <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2 group-hover/card:scale-110 transition-transform" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Volume
            </span>
          </div>
          {priceLoading ? (
            <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-8 rounded-lg"></div>
          ) : (
            <p className="text-2xl font-black text-gray-900 dark:text-white text-center group-hover/card:scale-105 transition-transform">
              {volume ? (volume / 1000).toFixed(0) + "K" : "N/A"}
            </p>
          )}
        </div>
      </div>

      {company.marketCap && (
        <div className="mt-6 pt-6 border-t-2 border-gray-200 dark:border-gray-600">
          <div className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800 shadow-md">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block mb-2">
              Market Cap
            </span>
            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-300 dark:to-purple-300">
              ₹{(company.marketCap / 10000000).toFixed(0)} Crores
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
