import React, { useState } from 'react';

const NumberForm = ({ onSubmit }) => {
  const [numberId, setNumberId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (numberId) {
      onSubmit(numberId);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="numberId" className="block text-sm font-medium text-gray-700 mb-1">
          Select Number Type
        </label>
        <select
          id="numberId"
          value={numberId}
          onChange={(e) => setNumberId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="" disabled>Select a number type</option>
          <option value="p">Prime Numbers</option>
          <option value="f">Fibonacci Numbers</option>
          <option value="e">Even Numbers</option>
          <option value="r">Random Numbers</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={!numberId}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Fetch Numbers
      </button>
    </form>
  );
};

export default NumberForm;