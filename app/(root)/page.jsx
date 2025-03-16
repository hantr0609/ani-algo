'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import ProcessManagement from '../components/process/ProcessManagement';
import Visualization from '../components/Visualization';

export default function Home() {
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState('fifo');

  function handleProcessesGenerated(newProcesses) {
    setProcesses(newProcesses);
  }

  function handleAlgorithmChange(newAlgorithm) {
    setAlgorithm(newAlgorithm);
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <Header />
      <Navbar
        onProcessesGenerated={handleProcessesGenerated}
        onAlgorithmChange={handleAlgorithmChange}
      />
      <main className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProcessManagement />
        <Visualization processes={processes} algorithm={algorithm} />
      </main>
    </div>
  );
}
