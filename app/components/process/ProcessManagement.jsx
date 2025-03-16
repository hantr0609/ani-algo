'use client';

import { useState, useEffect } from 'react';

export default function ProcessManagement({ algorithm, onSettingsChange }) {
  const [timeQuantum, setTimeQuantum] = useState(1);
  const [priorityLevels, setPriorityLevels] = useState(3);
  const [numProcesses, setNumProcesses] = useState(5);

  // Update parent component when settings change
  useEffect(() => {
    onSettingsChange({
      timeQuantum: parseInt(timeQuantum),
      priorityLevels: parseInt(priorityLevels),
      numProcesses: parseInt(numProcesses),
    });
  }, [timeQuantum, priorityLevels, numProcesses]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow">
      <h2 className="text-lg font-semibold mb-4">Process Management</h2>
      {(algorithm === 'rr' || algorithm === 'mlfq') && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            Time Quantum {algorithm === 'mlfq' && '(Base)'}
          </label>
          <input
            type="number"
            value={timeQuantum}
            onChange={(e) =>
              setTimeQuantum(Math.max(1, parseInt(e.target.value) || 1))
            }
            min="1"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          {algorithm === 'rr' && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Each process will run for this time quantum before being preempted
            </p>
          )}
        </div>
      )}

      {algorithm === 'mlfq' && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            Priority Levels
          </label>
          <input
            type="number"
            value={priorityLevels}
            onChange={(e) =>
              setPriorityLevels(Math.max(2, parseInt(e.target.value) || 2))
            }
            min="2"
            max="5"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Number of queue levels (2-5). Each level doubles the time quantum.
          </p>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">
          Number of Processes
        </label>
        <select
          value={numProcesses}
          onChange={(e) => setNumProcesses(parseInt(e.target.value))}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="3">3 Processes</option>
          <option value="4">4 Processes</option>
          <option value="5">5 Processes</option>
          <option value="6">6 Processes</option>
        </select>
      </div>

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
        <h3 className="text-sm font-medium mb-2">Current Settings</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300">
          {(algorithm === 'rr' || algorithm === 'mlfq') && (
            <li>Time Quantum: {timeQuantum}</li>
          )}
          {algorithm === 'mlfq' && (
            <>
              <li>Priority Levels: {priorityLevels}</li>
              <li>
                Queue Time Quanta:{' '}
                {Array.from(
                  { length: priorityLevels },
                  (_, i) => timeQuantum * Math.pow(2, i)
                ).join(', ')}
              </li>
            </>
          )}
          <li>Number of Processes: {numProcesses}</li>
        </ul>
      </div>
    </div>
  );
}
