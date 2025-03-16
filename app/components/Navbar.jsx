'use client';

import { useState, useEffect } from 'react';

export default function Navbar({
  onProcessesGenerated,
  onAlgorithmChange,
  settings,
}) {
  const [algorithm, setAlgorithm] = useState('fifo');

  function generateProcesses() {
    const newProcesses = Array.from(
      { length: settings.numProcesses },
      (_, index) => ({
        id: index + 1,
        arrivalTime: Math.floor(Math.random() * 10),
        burstTime: Math.floor(Math.random() * 8) + 1,
      })
    );
    onProcessesGenerated(newProcesses);
  }

  const handleAlgorithmChange = (e) => {
    const newAlgorithm = e.target.value;
    setAlgorithm(newAlgorithm);
    onAlgorithmChange(newAlgorithm);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 p-4 shadow-md border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <select
          value={algorithm}
          onChange={handleAlgorithmChange}
          className="p-2 rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-900"
        >
          <option value="fifo">First In First Out (FIFO)</option>
          <option value="sjf">Shortest Job First (SJF)</option>
          <option value="stcf">Shortest Time to Completion First (STCF)</option>
          <option value="rr">Round Robin (RR)</option>
          <option value="mlfq">Multi-Level Feedback Queue (MLFQ)</option>
        </select>
        <button
          onClick={generateProcesses}
          className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Generate Processes
        </button>
      </div>
    </nav>
  );
}
