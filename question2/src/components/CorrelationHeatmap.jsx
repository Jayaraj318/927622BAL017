import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Tooltip as MuiTooltip, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow 
} from '@mui/material';
import { calculateAverage, calculateStandardDeviation } from '../utils/dataUtils';

const CorrelationHeatmap = ({ correlationMatrix, stocksData }) => {
  const [selectedStock, setSelectedStock] = useState(null);
  
  // Extract tickers from the correlation matrix
  const tickers = correlationMatrix.map(item => item.ticker);
  
  // Calculate statistics for each stock
  const stockStats = {};
  stocksData.forEach(stock => {
    const prices = stock.data.map(point => point.price).filter(price => price !== null);
    stockStats[stock.ticker] = {
      average: calculateAverage(prices),
      stdDev: calculateStandardDeviation(prices)
    };
  });
  
  // Function to get color based on correlation value
  const getCorrelationColor = (value) => {
    if (value === null || value === undefined) return '#f5f5f5';
    
    // Color scale from dark red (-1) to white (0) to green (1)
    if (value < 0) {
      // Red scale for negative correlations
      const intensity = Math.floor(255 * Math.abs(value));
      return `rgb(${255}, ${255 - intensity}, ${255 - intensity})`;
    } else {
      // Green scale for positive correlations
      const intensity = Math.floor(255 * value);
      return `rgb(${255 - intensity}, ${255}, ${255 - intensity})`;
    }
  };
  
  const handleCellHover = (ticker) => {
    setSelectedStock(ticker);
  };
  
  const handleCellLeave = () => {
    setSelectedStock(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" align="center" gutterBottom>
        Stock Correlation Heatmap
      </Typography>
      
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    {tickers.map(ticker => (
                      <TableCell 
                        key={ticker}
                        align="center"
                        onMouseEnter={() => handleCellHover(ticker)}
                        onMouseLeave={handleCellLeave}
                        sx={{ 
                          fontWeight: selectedStock === ticker ? 'bold' : 'normal',
                          backgroundColor: selectedStock === ticker ? '#f0f0f0' : 'inherit'
                        }}
                      >
                        {ticker}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {correlationMatrix.map(row => (
                    <TableRow key={row.ticker}>
                      <TableCell 
                        component="th" 
                        scope="row"
                        onMouseEnter={() => handleCellHover(row.ticker)}
                        onMouseLeave={handleCellLeave}
                        sx={{ 
                          fontWeight: selectedStock === row.ticker ? 'bold' : 'normal',
                          backgroundColor: selectedStock === row.ticker ? '#f0f0f0' : 'inherit'
                        }}
                      >
                        {row.ticker}
                      </TableCell>
                      {tickers.map(ticker => (
                        <MuiTooltip
                          key={ticker}
                          title={`Correlation: ${row.correlations[ticker].toFixed(2)}`}
                          arrow
                        >
                          <TableCell 
                            align="center"
                            sx={{ 
                              backgroundColor: getCorrelationColor(row.correlations[ticker]),
                              width: 60,
                              height: 60
                            }}
                          >
                            {row.correlations[ticker].toFixed(2)}
                          </TableCell>
                        </MuiTooltip>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Legend
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 20, height: 20, backgroundColor: getCorrelationColor(-1), mr: 1 }} />
                <Typography variant="body2">-1.0 (Strong Negative Correlation)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 20, height: 20, backgroundColor: getCorrelationColor(0), mr: 1 }} />
                <Typography variant="body2">0.0 (No Correlation)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ width: 20, height: 20, backgroundColor: getCorrelationColor(1), mr: 1 }} />
                <Typography variant="body2">1.0 (Strong Positive Correlation)</Typography>
              </Box>
              
              {selectedStock && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {selectedStock} Statistics:
                  </Typography>
                  <Typography variant="body2">
                    Average Price: ${stockStats[selectedStock]?.average.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                    Standard Deviation: ${stockStats[selectedStock]?.stdDev.toFixed(2)}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CorrelationHeatmap;