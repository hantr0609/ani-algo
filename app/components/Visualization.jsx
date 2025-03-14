'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFIFO } from '../algorithm/useFifo';
import { useSJF } from '../algorithm/useSJF';
import MetricCard from './MetricCard';

const generateRandomProcesses = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    arrivalTime: Math.floor(Math.random() * 10),
    burstTime: Math.floor(Math.random() * 8) + 1,
  }));
};

const ProcessTimeline = ({ timeline, maxTime }) => {
  return (
    <div className="relative h-16 bg-gray-100 dark:bg-gray-700 rounded-lg mt-4 overflow-hidden">
      {/* Grid lines */}
      <div className="absolute inset-0 w-full h-full">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="absolute h-full w-px bg-gray-200 dark:bg-gray-600"
            style={{ left: `${(i + 1) * 10}%` }}
          />
        ))}
      </div>

      {timeline.map((block, index) => {
        const widthPercentage =
          ((block.endTime - block.startTime) * 100) / maxTime;
        const leftPosition = (block.startTime * 100) / maxTime;

        return (
          <motion.div
            key={`${block.processId}-${index}`}
            initial={{ width: 0, left: `${leftPosition}%` }}
            animate={{
              width: `${widthPercentage}%`,
              left: `${leftPosition}%`,
            }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', height: '100%' }}
            className={`${
              block.processId === 'idle'
                ? 'bg-gray-300 dark:bg-gray-600'
                : 'bg-blue-500 dark:bg-blue-600'
            } border-l border-r border-white dark:border-gray-50`}
          >
            <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
              {block.processId === 'idle' ? 'Idle' : `P${block.processId}`}
            </span>
          </motion.div>
        );
      })}

      {/* Time markers */}
      <div className="absolute bottom-0 w-full h-6 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className="relative" style={{ left: `${i * 20}%` }}>
            {Math.floor((i * maxTime) / 5)}
          </span>
        ))}
      </div>
    </div>
  );
};

const ProcessTable = ({ processes }) => {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2">Process ID</th>
            <th className="px-4 py-2">Arrival Time</th>
            <th className="px-4 py-2">Burst Time</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process) => (
            <motion.tr
              key={process.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="px-4 py-2 text-center">P{process.id}</td>
              <td className="px-4 py-2 text-center">{process.arrivalTime}</td>
              <td className="px-4 py-2 text-center">{process.burstTime}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function Visualization() {
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState('fifo');
  const [result, setResult] = useState(null);

  const { calculateFIFO } = useFIFO();
  const { calculateSJF } = useSJF();

  const generateProcesses = () => {
    const newProcesses = generateRandomProcesses(5);
    setProcesses(newProcesses);
  };

  useEffect(() => {
    if (processes.length > 0) {
      const calculationResult =
        algorithm === 'fifo'
          ? calculateFIFO(processes)
          : calculateSJF(processes);
      setResult(calculationResult);
    }
  }, [processes, algorithm]);

  const maxTime =
    result?.timeline.reduce((max, block) => Math.max(max, block.endTime), 0) ||
    0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Visualization</h2>
        <div className="flex gap-4">
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="px-3 py-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="fifo">FIFO</option>
            <option value="sjf">SJF</option>
          </select>
          <button
            onClick={generateProcesses}
            className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Generate Processes
          </button>
        </div>
      </div>

      {processes.length > 0 && (
        <>
          <ProcessTable processes={processes} />

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key={algorithm}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProcessTimeline timeline={result.timeline} maxTime={maxTime} />

                <div className="flex gap-4 mt-4">
                  <MetricCard
                    title="Avg Waiting Time"
                    value={result.averageWaitingTime.toFixed(2)}
                  />
                  <MetricCard
                    title="Avg Turnaround Time"
                    value={result.averageTurnaroundTime.toFixed(2)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
