import React from 'react';

const ResultDisplay = ({ result }) => {
  const { windowPrevState, windowCurrState, numbers, avg } = result;

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold mb-3">Results</h2>
      
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Window Previous State</h3>
          <p className="text-gray-900">{windowPrevState}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Window Current State</h3>
          <p className="text-gray-900">{windowCurrState}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Numbers</h3>
          <div className="bg-white p-2 rounded border border-gray-200 max-h-32 overflow-y-auto">
            <p className="text-gray-900 break-words">{numbers.join(', ')}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Average</h3>
          <p className="text-xl font-bold text-blue-600">{avg.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;