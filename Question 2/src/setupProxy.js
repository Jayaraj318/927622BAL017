const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Create a mock API for development when the backend is not available
  app.get('/numbers/:numberId', (req, res) => {
    const { numberId } = req.params;
    
    // Generate mock data based on the numberId
    let numbers = [];
    let avg = 0;
    
    switch(numberId) {
      case 'p': // Prime numbers
        numbers = [2, 3, 5, 7, 11, 13, 17, 19];
        break;
      case 'f': // Fibonacci numbers
        numbers = [1, 1, 2, 3, 5, 8, 13, 21];
        break;
      case 'e': // Even numbers
        numbers = [2, 4, 6, 8, 10, 12, 14, 16];
        break;
      case 'r': // Random numbers
        numbers = Array.from({length: 8}, () => Math.floor(Math.random() * 100));
        break;
      default:
        return res.status(400).json({ error: 'Invalid number ID' });
    }
    
    // Calculate average
    avg = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    
    // Return mock response
    res.json({
      windowPrevState: 'Mock Previous State',
      windowCurrState: 'Mock Current State',
      numbers,
      avg
    });
  });
  
  // Original proxy configuration (kept for when backend is available)
  app.use(
    '/numbers',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: {
        '^/numbers': '/numbers',
      },
      onError: (err, req, res) => {
        // This will be called when the backend is not available
        // The mock API above will handle the request instead
        console.log('Proxy error:', err);
      }
    })
  );
};