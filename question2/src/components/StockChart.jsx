import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ReferenceLine, ResponsiveContainer 
} from 'recharts';
import { Box, Typography, Paper } from '@mui/material';
import { calculateAverage } from '../utils/dataUtils';

const StockChart = ({ data, ticker }) => {
  const formattedData = useMemo(() => {
    return data.map(point => ({
      ...point,
      time: new Date(point.timestamp).toLocaleTimeString(),
    }));
  }, [data]);

  const averagePrice = useMemo(() => {
    const prices = data.map(point => point.price);
    return calculateAverage(prices);
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="body2">Time: {label}</Typography>
          <Typography variant="body2" color="primary">
            Price: ${payload[0].value.toFixed(2)}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Typography variant="h6" align="center" gutterBottom>
        {ticker} Stock Price
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <ReferenceLine 
            y={averagePrice} 
            label={{ value: `Avg: $${averagePrice.toFixed(2)}`, position: 'insideBottomRight' }} 
            stroke="red" 
            strokeDasharray="3 3" 
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            name={`${ticker} Price`}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StockChart;