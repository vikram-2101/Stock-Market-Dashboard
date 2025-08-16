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
      IT: "bg-blue-100 text-blue-800",
      Banking: "bg-green-100 text-green-800",
      Energy: "bg-red-100 text-red-800",
      FMCG: "bg-purple-100 text-purple-800",
      Telecom: "bg-orange-100 text-orange-800",
      Paints: "bg-yellow-100 text-yellow-800",
      Automotive: "bg-gray-100 text-gray-800",
      Finance: "bg-indigo-100 text-indigo-800",
    };
    return colors[sector] || "bg-gray-100 text-gray-800";
  };

  const currentPrice = getCurrentPrice();
  const priceChange = getPriceChange();
  const isPositive = priceChange.change >= 0;
  const volume =
    priceData?.volume ||
    (stockData?.length > 0 ? stockData[stockData.length - 1].volume : 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
          <p className="text-gray-600">{company.symbol}</p>
          {company.description && (
            <p className="text-sm text-gray-500 mt-2 max-w-2xl">
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
              className="text-sm text-blue-600 hover:text-blue-800 mt-2"
            >
              Visit Website
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-5 w-5 text-gray-600 mr-1" />
            <span className="text-sm font-medium text-gray-600">
              Current Price
            </span>
          </div>
          {priceLoading ? (
            <div className="animate-pulse bg-gray-200 h-8 rounded"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900">
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
              <TrendingUp className="h-5 w-5 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600 mr-1" />
            )}
            <span className="text-sm font-medium text-gray-600">Change</span>
          </div>
          {priceLoading ? (
            <div className="animate-pulse bg-gray-200 h-8 rounded"></div>
          ) : (
            <p
              className={`text-2xl font-bold ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}₹{Math.abs(priceChange.change).toFixed(2)}
            </p>
          )}
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600 mr-1" />
            )}
            <span className="text-sm font-medium text-gray-600">Change %</span>
          </div>
          {priceLoading ? (
            <div className="animate-pulse bg-gray-200 h-8 rounded"></div>
          ) : (
            <p
              className={`text-2xl font-bold ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {priceChange.percentage.toFixed(2)}%
            </p>
          )}
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <BarChart3 className="h-5 w-5 text-gray-600 mr-1" />
            <span className="text-sm font-medium text-gray-600">Volume</span>
          </div>
          {priceLoading ? (
            <div className="animate-pulse bg-gray-200 h-8 rounded"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900">
              {volume ? (volume / 1000).toFixed(0) + "K" : "N/A"}
            </p>
          )}
        </div>
      </div>

      {company.marketCap && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-center">
            <span className="text-sm font-medium text-gray-600">
              Market Cap
            </span>
            <p className="text-lg font-bold text-gray-900">
              ₹{(company.marketCap / 10000000).toFixed(0)} Crores
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
