import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Container, Box, 
  Button, CssBaseline, ThemeProvider, createTheme 
} from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import GridOnIcon from '@mui/icons-material/GridOn';
import StockPage from './pages/StockPage';
import CorrelationPage from './pages/CorrelationPage';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <ShowChartIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Stock Price Aggregator
            </Typography>
            <Button color="inherit" component={Link} to="/" startIcon={<ShowChartIcon />}>
              Stock Chart
            </Button>
            <Button color="inherit" component={Link} to="/correlation" startIcon={<GridOnIcon />}>
              Correlation
            </Button>
          </Toolbar>
        </AppBar>
        
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<StockPage />} />
            <Route path="/correlation" element={<CorrelationPage />} />
          </Routes>
        </Container>
        
        <Box component="footer" sx={{ bgcolor: 'background.paper', py: 3, mt: 4 }}>
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              Stock Price Aggregator © {new Date().getFullYear()}
            </Typography>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
