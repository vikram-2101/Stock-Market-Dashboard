const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = {
  // Get all companies
  getCompanies: async () => {
    const response = await fetch(`${API_BASE_URL}/companies`);
    if (!response.ok) {
      throw new Error(`Failed to fetch companies: ${response.status}`);
    }
    return response.json();
  },

  // Get company by ID
  getCompany: async (id) => {
    const response = await fetch(`${API_BASE_URL}/companies/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch company: ${response.status}`);
    }
    return response.json();
  },

  // Get stock data for a company
  getStockData: async (companyId, days = 30) => {
    const response = await fetch(
      `${API_BASE_URL}/companies/${companyId}/stock-data?days=${days}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch stock data: ${response.status}`);
    }
    return response.json();
  },

  // Get latest price for a company
  getLatestPrice: async (companyId) => {
    const response = await fetch(
      `${API_BASE_URL}/companies/${companyId}/latest-price`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch latest price: ${response.status}`);
    }
    return response.json();
  },

  // Get market summary
  getMarketSummary: async () => {
    const response = await fetch(`${API_BASE_URL}/market-summary`);
    if (!response.ok) {
      throw new Error(`Failed to fetch market summary: ${response.status}`);
    }
    return response.json();
  },

  // Search companies
  searchCompanies: async (query) => {
    const response = await fetch(
      `${API_BASE_URL}/search/companies?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error(`Failed to search companies: ${response.status}`);
    }
    return response.json();
  },

  // Health check
  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`Failed to check health: ${response.status}`);
    }
    return response.json();
  },
};
