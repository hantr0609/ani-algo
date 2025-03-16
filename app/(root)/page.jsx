'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import ProcessManagement from '../components/process/ProcessManagement';
import Visualization from '../components/Visualization';

export default function Home() {
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState('fifo');
  const [result, setResult] = useState(null);
  const [allResults, setAllResults] = useState(null);
  const [settings, setSettings] = useState({
    timeQuantum: 1,
    priorityLevels: 3,
    numProcesses: 5,
  });

  function handleProcessesGenerated(newProcesses) {
    setProcesses(newProcesses);
    setResult(null);
    setAllResults(null);
  }

  function handleAlgorithmChange(newAlgorithm) {
    setAlgorithm(newAlgorithm);
    setResult(null);
    setAllResults(null);
  }

  function handleSettingsChange(newSettings) {
    setSettings(newSettings);
  }

  function handleResults(newResult, newAllResults) {
    setResult(newResult);
    setAllResults(newAllResults);
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <Header />
      <Navbar
        onProcessesGenerated={handleProcessesGenerated}
        onAlgorithmChange={handleAlgorithmChange}
        settings={settings}
        processes={processes}
        result={result}
        allResults={allResults}
      />
      <main className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProcessManagement
          algorithm={algorithm}
          onSettingsChange={handleSettingsChange}
        />
        <Visualization
          processes={processes}
          algorithm={algorithm}
          settings={settings}
          onResults={handleResults}
        />
      </main>
    </div>
  );
}
