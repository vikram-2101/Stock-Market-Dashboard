import React, { useState } from "react";
import { Search } from "lucide-react";

const CompanyList = ({
  companies,
  selectedCompany,
  onSelectCompany,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (loading) {
    return (
      <div className="w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-200">
        <div className="p-4 border-b dark:border-gray-600">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-10 rounded"></div>
        </div>
        <div className="p-4 space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-600 h-16 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-200">
      <div className="p-4 border-b dark:border-gray-600">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      <div className="h-96 overflow-y-auto">
        {filteredCompanies.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No companies found
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <div
              key={company.id}
              onClick={() => onSelectCompany(company)}
              className={`p-4 border-b dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectedCompany?.id === company.id
                  ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500 dark:border-l-blue-400"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                    {company.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{company.symbol}</p>
                  {company.marketCap && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      MCap: ₹{(company.marketCap / 10000000).toFixed(0)}Cr
                    </p>
                  )}
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSectorColor(
                    company.sector
                  )}`}
                >
                  {company.sector}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyList;
