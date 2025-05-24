import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Box, Typography, Paper, FormControl, 
  InputLabel, Select, MenuItem, Grid, CircularProgress, Alert 
} from '@mui/material';
import StockChart from '../components/StockChart';
import { fetchStockData, getAvailableTickers } from '../services/stockService';

const StockPage = () => {
  const [ticker, setTicker] = useState('');
  const [availableTickers, setAvailableTickers] = useState([]);
  const [timeRange, setTimeRange] = useState(5); // Default 5 minutes
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available tickers on component mount
  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const tickers = await getAvailableTickers();
        setAvailableTickers(tickers);
        if (tickers.length > 0) {
          setTicker(tickers[0]);
        }
      } catch (err) {
        setError('Failed to fetch available tickers');
        console.error(err);
      }
    };

    fetchTickers();
  }, []);

  // Fetch stock data when ticker or time range changes
  const fetchData = useCallback(async () => {
    if (!ticker) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchStockData(ticker, timeRange);
      setStockData(data);
    } catch (err) {
      setError(`Failed to fetch stock data for ${ticker}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [ticker, timeRange]);

  // Initial data fetch and setup interval for real-time updates
  useEffect(() => {
    fetchData();
    
    // Set up interval for real-time updates (every 10 seconds)
    const intervalId = setInterval(fetchData, 10000);
    
    // Clean up interval on component unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const handleTickerChange = (event) => {
    setTicker(event.target.value);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Stock Price Tracker
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="ticker-select-label">Stock Ticker</InputLabel>
                <Select
                  labelId="ticker-select-label"
                  id="ticker-select"
                  value={ticker}
                  label="Stock Ticker"
                  onChange={handleTickerChange}
                >
                  {availableTickers.map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="time-range-select-label">Time Range (minutes)</InputLabel>
                <Select
                  labelId="time-range-select-label"
                  id="time-range-select"
                  value={timeRange}
                  label="Time Range (minutes)"
                  onChange={handleTimeRangeChange}
                >
                  <MenuItem value={5}>5 minutes</MenuItem>
                  <MenuItem value={15}>15 minutes</MenuItem>
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={60}>60 minutes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading && !stockData.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={3} sx={{ p: 3 }}>
            {stockData.length > 0 ? (
              <StockChart data={stockData} ticker={ticker} />
            ) : (
              <Typography variant="body1" align="center">
                No data available for the selected stock and time range.
              </Typography>
            )}
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default StockPage;