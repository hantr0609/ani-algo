'use client';

import { useState, useEffect } from 'react';
import { useFIFO } from '../algorithm/useFifo';
import { useSJF } from '../algorithm/useSJF';
import { useSTCF } from '../algorithm/useSTCF';

const generateRandomProcesses = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    arrivalTime: Math.floor(Math.random() * 10),
    burstTime: Math.floor(Math.random() * 8) + 1,
  }));
};

export default function Navbar({ onProcessesGenerated, onAlgorithmChange }) {
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState('fifo');
  const [result, setResult] = useState(null);

  const { calculateFIFO } = useFIFO();
  const { calculateSJF } = useSJF();
  const { calculateSTCF } = useSTCF();

  function generateProcesses() {
    const newProcesses = generateRandomProcesses(5);
    setProcesses(newProcesses);
    onProcessesGenerated(newProcesses);
  }

  const maxTime =
    result?.timeline.reduce((max, block) => Math.max(max, block.endTime), 0) ||
    0;

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
