import React, { useState } from 'react';
import './App.css';
import NumberForm from './components/NumberForm';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNumbers = async (numberId) => {
    setLoading(true);
    setError(null);
    
    try {
      const startTime = performance.now();
      const response = await fetch(`/numbers/${numberId}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      const endTime = performance.now();
      
      // Check if total time is under 500ms
      const totalTime = endTime - startTime;
      console.log(`Request completed in ${totalTime.toFixed(2)}ms`);
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Number Statistics</h1>
        <NumberForm onSubmit={fetchNumbers} />
        
        {loading && (
          <div className="mt-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading data...</p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && result && (
          <ResultDisplay result={result} />
        )}
      </div>
    </div>
  );
}

export default App;