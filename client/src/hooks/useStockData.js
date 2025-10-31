import { useState, useEffect } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Hook for fetching companies
export const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/companies`);
        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.status}`);
        }

        const data = await response.json();
        setCompanies(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return { companies, loading, error };
};

// Hook for fetching stock data
export const useStockData = (companyId, days = 30) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) {
      setStockData([]);
      return;
    }

    const fetchStockData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/companies/${companyId}/stock-data?days=${days}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch stock data: ${response.status}`);
        }

        const data = await response.json();
        setStockData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching stock data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [companyId, days]);

  return { stockData, loading, error };
};

export const useRealTimePrice = (companyId) => {
  const [price, setPrice] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!companyId) return;

    const fetchPrice = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/companies/${companyId}/latest-price`
        );
        const data = await res.json();
        setPrice(data);
        setConnected(true);
      } catch (err) {
        console.error("❌ Error fetching price:", err);
        setConnected(false);
      }
    };

    fetchPrice(); // first call immediately
    const interval = setInterval(fetchPrice, 5000); // poll every 5s

    return () => clearInterval(interval);
  }, [companyId]);

  return { price, connected };
};
