import axios from 'axios';

// Base URL for the stock exchange test server API
const API_BASE_URL = 'https://api.example.com'; // Replace with actual API URL

// Fetch stock data for a specific ticker for the last m minutes
export const fetchStockData = async (ticker, minutes) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stocks/${ticker}`, {
      params: { minutes }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock data for ${ticker}:`, error);
    throw error;
  }
};

// Fetch data for multiple stocks for correlation calculation
export const fetchMultipleStocksData = async (tickers, minutes) => {
  try {
    const promises = tickers.map(ticker => fetchStockData(ticker, minutes));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error fetching multiple stocks data:', error);
    throw error;
  }
};

// Get available stock tickers
export const getAvailableTickers = async () => {
  try {
    // For testing purposes, return some mock tickers
    // In a real application, this would fetch from the API
    
    // Uncomment the following code when you have a real API endpoint
    // const response = await axios.get(`${API_BASE_URL}/tickers`);
    // return response.data;
    
    return ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NFLX'];
  } catch (error) {
    console.error('Error fetching available tickers:', error);
    throw error;
  }
};