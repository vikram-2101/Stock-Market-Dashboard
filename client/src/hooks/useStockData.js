// frontend/src/hooks/useStockData.js
import { useState, useEffect } from "react";

const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL || "http://localhost:5000/api";

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

    const ws = new WebSocket(`ws://localhost:5000/ws/price/${companyId}`);

    ws.onopen = () => {
      setConnected(true);
      console.log("✅ WebSocket connected for company:", companyId);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setPrice(data); // Or `data.price` if that's your format
      } catch (err) {
        console.error("❌ Error parsing WebSocket message:", err);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      console.log("🔌 WebSocket disconnected");
    };

    ws.onerror = (error) => {
      console.error("⚠️ WebSocket error:", error);
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [companyId]);

  return { price, connected };
};
