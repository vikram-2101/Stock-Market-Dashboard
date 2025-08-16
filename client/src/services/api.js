const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request handler with error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // GET request helper
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: "GET" });
  }

  // POST request helper
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PUT request helper
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // DELETE request helper
  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  // Company-related methods
  async getCompanies(filters = {}) {
    return this.get("/companies", filters);
  }

  async getCompanyById(companyId) {
    return this.get(`/companies/${companyId}`);
  }

  async searchCompanies(query, limit = 10) {
    return this.get("/companies/search", { q: query, limit });
  }

  async getCompaniesBySector(sector) {
    return this.get("/companies", { sector });
  }

  // Stock data methods
  async getStockData(companyId, days = 30) {
    return this.get(`/stock-data/${companyId}`, { days });
  }

  async getStockDataRange(companyId, startDate, endDate) {
    return this.get(`/stock-data/${companyId}`, {
      start_date: startDate,
      end_date: endDate,
    });
  }

  async getCurrentPrice(companyId) {
    return this.get(`/stock-data/${companyId}/current`);
  }

  async getMultipleCurrentPrices(companyIds) {
    return this.post("/stock-data/current/batch", { company_ids: companyIds });
  }

  // Market data methods
  async getMarketSummary() {
    return this.get("/market/summary");
  }

  async getMarketStatus() {
    return this.get("/market/status");
  }

  async getTopGainers(limit = 10) {
    return this.get("/market/gainers", { limit });
  }

  async getTopLosers(limit = 10) {
    return this.get("/market/losers", { limit });
  }

  async getMostActive(limit = 10) {
    return this.get("/market/most-active", { limit });
  }

  // Portfolio methods (for future enhancement)
  async createPortfolio(portfolioData) {
    return this.post("/portfolio", portfolioData);
  }

  async getPortfolios() {
    return this.get("/portfolio");
  }

  async addToPortfolio(portfolioId, stockData) {
    return this.post(`/portfolio/${portfolioId}/stocks`, stockData);
  }

  async removeFromPortfolio(portfolioId, stockId) {
    return this.delete(`/portfolio/${portfolioId}/stocks/${stockId}`);
  }

  // Watchlist methods (for future enhancement)
  async getWatchlist() {
    return this.get("/watchlist");
  }

  async addToWatchlist(companyId) {
    return this.post("/watchlist", { company_id: companyId });
  }

  async removeFromWatchlist(companyId) {
    return this.delete(`/watchlist/${companyId}`);
  }

  // News and analysis methods (for future enhancement)
  async getStockNews(companyId, limit = 10) {
    return this.get(`/news/${companyId}`, { limit });
  }

  async getMarketNews(limit = 20) {
    return this.get("/news/market", { limit });
  }

  // Historical data export
  async exportStockData(companyId, format = "csv", days = 365) {
    const response = await fetch(
      `${this.baseURL}/stock-data/${companyId}/export?format=${format}&days=${days}`
    );

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Bulk data operations
  async bulkImportStockData(csvData) {
    const formData = new FormData();
    formData.append("file", csvData);

    const response = await fetch(`${this.baseURL}/stock-data/import`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Import failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Health check
  async healthCheck() {
    return this.get("/health");
  }

  // WebSocket connection helper
  createWebSocketConnection(endpoint) {
    const wsURL = this.baseURL.replace("http", "ws").replace("/api", "");
    return new WebSocket(`${wsURL}/ws${endpoint}`);
  }

  // Real-time price subscription
  subscribeToPrice(companyId, onMessage, onError) {
    const ws = this.createWebSocketConnection(`/price/${companyId}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        onError && onError(error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      onError && onError(error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return ws;
  }

  // Market data subscription
  subscribeToMarketData(onMessage, onError) {
    const ws = this.createWebSocketConnection("/market");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("Error parsing market WebSocket message:", error);
        onError && onError(error);
      }
    };

    ws.onerror = (error) => {
      console.error("Market WebSocket error:", error);
      onError && onError(error);
    };

    return ws;
  }

  // Cache management
  clearCache() {
    // Clear any cached data if implementing caching
    if (typeof window !== "undefined" && window.localStorage) {
      const keys = Object.keys(window.localStorage);
      keys.forEach((key) => {
        if (key.startsWith("stock_cache_")) {
          window.localStorage.removeItem(key);
        }
      });
    }
  }

  // Error handling utility
  handleApiError(error, context = "") {
    const errorMessage = error.message || "An unexpected error occurred";
    const errorContext = context ? `[${context}] ` : "";

    console.error(`${errorContext}API Error:`, error);

    // You can extend this to show toast notifications or other UI feedback
    return {
      message: errorMessage,
      context,
      timestamp: new Date().toISOString(),
    };
  }
}

// Create a singleton instance
const stockService = new ApiService();

// Export individual methods for convenience
export const {
  getCompanies,
  getCompanyById,
  searchCompanies,
  getStockData,
  getCurrentPrice,
  getMarketSummary,
  getMarketStatus,
  getTopGainers,
  getTopLosers,
  getMostActive,
  subscribeToPrice,
  subscribeToMarketData,
  exportStockData,
  healthCheck,
} = stockService;

// Export the service class and instance
export { ApiService };
export default stockService;
