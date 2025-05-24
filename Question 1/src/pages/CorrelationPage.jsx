import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Box, Typography, Paper, FormControl, 
  InputLabel, Select, MenuItem, Grid, CircularProgress, Alert,
  Checkbox, ListItemText, OutlinedInput
} from '@mui/material';
import CorrelationHeatmap from '../components/CorrelationHeatmap';
import { 
  fetchMultipleStocksData, 
  getAvailableTickers 
} from '../services/stockService';
import { 
  alignTimeSeriesData, 
  extractPriceArrays, 
  calculateCorrelationMatrix 
} from '../utils/dataUtils';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CorrelationPage = () => {
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [availableTickers, setAvailableTickers] = useState([]);
  const [timeRange, setTimeRange] = useState(5); // Default 5 minutes
  const [stocksData, setStocksData] = useState([]);
  const [correlationMatrix, setCorrelationMatrix] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available tickers on component mount
  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const tickers = await getAvailableTickers();
        setAvailableTickers(tickers);
        // Select first 5 tickers by default (or all if less than 5)
        setSelectedTickers(tickers.slice(0, Math.min(5, tickers.length)));
      } catch (err) {
        setError('Failed to fetch available tickers');
        console.error(err);
      }
    };

    fetchTickers();
  }, []);

  // Calculate correlation matrix from stocks data
  const calculateCorrelations = useCallback((data) => {
    if (!data || data.length < 2) return [];
    
    const alignedData = alignTimeSeriesData(data);
    const priceArrays = extractPriceArrays(alignedData);
    return calculateCorrelationMatrix(priceArrays);
  }, []);

  // Fetch stocks data when selected tickers or time range changes
  const fetchData = useCallback(async () => {
    if (selectedTickers.length < 2) {
      setError('Please select at least 2 stocks for correlation analysis');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchMultipleStocksData(selectedTickers, timeRange);
      setStocksData(data);
      const matrix = calculateCorrelations(data);
      setCorrelationMatrix(matrix);
    } catch (err) {
      setError('Failed to fetch stock data for correlation analysis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedTickers, timeRange, calculateCorrelations]);

  // Initial data fetch and setup interval for real-time updates
  useEffect(() => {
    if (selectedTickers.length >= 2) {
      fetchData();
      
      // Set up interval for real-time updates (every 30 seconds)
      const intervalId = setInterval(fetchData, 30000);
      
      // Clean up interval on component unmount or when dependencies change
      return () => clearInterval(intervalId);
    }
  }, [fetchData, selectedTickers.length]);

  const handleTickersChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTickers(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Stock Correlation Analysis
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="tickers-multiple-checkbox-label">Select Stocks</InputLabel>
                <Select
                  labelId="tickers-multiple-checkbox-label"
                  id="tickers-multiple-checkbox"
                  multiple
                  value={selectedTickers}
                  onChange={handleTickersChange}
                  input={<OutlinedInput label="Select Stocks" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {availableTickers.map((ticker) => (
                    <MenuItem key={ticker} value={ticker}>
                      <Checkbox checked={selectedTickers.indexOf(ticker) > -1} />
                      <ListItemText primary={ticker} />
                    </MenuItem>
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
        
        {selectedTickers.length < 2 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Please select at least 2 stocks to view correlation analysis.
          </Alert>
        )}
        
        {loading && correlationMatrix.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          correlationMatrix.length > 0 && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <CorrelationHeatmap 
                correlationMatrix={correlationMatrix} 
                stocksData={stocksData} 
              />
            </Paper>
          )
        )}
      </Box>
    </Container>
  );
};

export default CorrelationPage;