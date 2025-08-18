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

  if (loading) {
    return (
      <div className="w-1/3 bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
        </div>
        <div className="p-4 space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-16 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/3 bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="h-96 overflow-y-auto">
        {filteredCompanies.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No companies found
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <div
              key={company.id}
              onClick={() => onSelectCompany(company)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedCompany?.id === company.id
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {company.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{company.symbol}</p>
                  {company.marketCap && (
                    <p className="text-xs text-gray-400 mt-1">
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
