'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFIFO } from '../algorithm/useFifo';
import { useSJF } from '../algorithm/useSJF';
import { useSTCF } from '../algorithm/useSTCF';

import MetricCard from './MetricCard';
import ProcessTimeline from './ProcessTimeline';

const generateRandomProcesses = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    arrivalTime: Math.floor(Math.random() * 10),
    burstTime: Math.floor(Math.random() * 8) + 1,
  }));
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
  const { calculateSTCF } = useSTCF();

  const generateProcesses = () => {
    const newProcesses = generateRandomProcesses(5);
    setProcesses(newProcesses);
  };

  useEffect(() => {
    if (processes.length > 0) {
      let calculationResult;

      switch (algorithm) {
        case 'fifo':
          calculationResult = calculateFIFO(processes);
          break;
        case 'sjf':
          calculationResult = calculateSJF(processes);
          break;
        case 'stcf':
          calculationResult = calculateSTCF(processes);
          break;
        default:
          calculationResult = calculateFIFO(processes);
      }

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
            <option value="fifo">First In First Out (FIFO)</option>
            <option value="sjf">Shortest Job First (SJF)</option>
            <option value="stcf">
              Shortest Time to Completion First (STCF)
            </option>
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
                <ProcessTimeline
                  timeline={result.timeline}
                  maxTime={maxTime}
                  result={result}
                />

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
