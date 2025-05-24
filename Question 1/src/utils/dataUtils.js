// Calculate average of an array of numbers
export const calculateAverage = (data) => {
  if (!data || data.length === 0) return 0;
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
};

// Calculate standard deviation of an array of numbers
export const calculateStandardDeviation = (data) => {
  if (!data || data.length <= 1) return 0;
  
  const avg = calculateAverage(data);
  const squareDiffs = data.map(value => {
    const diff = value - avg;
    return diff * diff;
  });
  
  const avgSquareDiff = calculateAverage(squareDiffs);
  return Math.sqrt(avgSquareDiff);
};

// Calculate Pearson correlation coefficient between two arrays
export const calculatePearsonCorrelation = (x, y) => {
  if (!x || !y || x.length !== y.length || x.length === 0) return 0;
  
  const n = x.length;
  const avgX = calculateAverage(x);
  const avgY = calculateAverage(y);
  
  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - avgX;
    const yDiff = y[i] - avgY;
    
    numerator += xDiff * yDiff;
    denominatorX += xDiff * xDiff;
    denominatorY += yDiff * yDiff;
  }
  
  if (denominatorX === 0 || denominatorY === 0) return 0;
  
  return numerator / (Math.sqrt(denominatorX) * Math.sqrt(denominatorY));
};

// Align time series data for multiple stocks
export const alignTimeSeriesData = (stocksData) => {
  if (!stocksData || stocksData.length === 0) return [];
  
  // Create a map of all timestamps across all stocks
  const allTimestamps = new Set();
  stocksData.forEach(stock => {
    stock.data.forEach(point => {
      allTimestamps.add(point.timestamp);
    });
  });
  
  // Sort timestamps
  const sortedTimestamps = Array.from(allTimestamps).sort();
  
  // Create aligned data for each stock
  return stocksData.map(stock => {
    const timestampToPrice = {};
    stock.data.forEach(point => {
      timestampToPrice[point.timestamp] = point.price;
    });
    
    const alignedData = sortedTimestamps.map(timestamp => ({
      timestamp,
      price: timestampToPrice[timestamp] || null
    }));
    
    return {
      ticker: stock.ticker,
      data: alignedData
    };
  });
};

// Extract price arrays for correlation calculation
export const extractPriceArrays = (alignedStocksData) => {
  const result = {};
  
  alignedStocksData.forEach(stock => {
    // Filter out null values
    const validData = stock.data.filter(point => point.price !== null);
    result[stock.ticker] = validData.map(point => point.price);
  });
  
  return result;
};

// Calculate correlation matrix for multiple stocks
export const calculateCorrelationMatrix = (priceArrays) => {
  const tickers = Object.keys(priceArrays);
  const matrix = [];
  
  tickers.forEach(ticker1 => {
    const row = {};
    tickers.forEach(ticker2 => {
      row[ticker2] = calculatePearsonCorrelation(priceArrays[ticker1], priceArrays[ticker2]);
    });
    matrix.push({ ticker: ticker1, correlations: row });
  });
  
  return matrix;
};