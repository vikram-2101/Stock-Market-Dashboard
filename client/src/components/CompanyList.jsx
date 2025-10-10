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
    <div className="w-1/3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden">
      <div className="p-5 border-b-2 border-gray-200 dark:border-gray-600 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-medium transition-all duration-300 shadow-sm focus:shadow-lg"
          />
        </div>
      </div>

      <div className="h-96 overflow-y-auto">
        {filteredCompanies.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No companies found
          </div>
        ) : (
          filteredCompanies.map((company) => {
            const isSelected = selectedCompany?.id === company.id;
            return (
              <div
                key={company.id}
                onClick={() => onSelectCompany(company)}
                className={`p-4 m-2 rounded-lg cursor-pointer transition-all duration-300 group ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 shadow-lg border-2 border-blue-400 dark:border-blue-500 scale-[1.02]"
                    : "bg-white dark:bg-gray-800/50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-700/50 dark:hover:to-blue-900/20 hover:shadow-md border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                      {company.name}
                    </h3>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded inline-block">
                      {company.symbol}
                    </p>
                    {company.marketCap && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                        MCap: ₹{(company.marketCap / 10000000).toFixed(0)}Cr
                      </p>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${getSectorColor(
                      company.sector
                    )} transition-all duration-300 group-hover:scale-105`}
                  >
                    {company.sector}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CompanyList;
