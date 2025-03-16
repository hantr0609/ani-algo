'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFIFO } from '../algorithm/useFifo';
import { useSJF } from '../algorithm/useSJF';
import { useSTCF } from '../algorithm/useSTCF';
import { useRR } from '../algorithm/useRR';
import { useMLFQ } from '../algorithm/useMLFQ';
import MetricCard from './MetricCard';
import ProcessTimeline from './process/ProcessTimeline';
import ProcessTable from './process/ProcessTable';
import Graph from './Graph';

export default function Visualization({ processes, algorithm, settings }) {
  const [result, setResult] = useState(null);
  const [allResults, setAllResults] = useState(null);

  const { calculateFIFO } = useFIFO();
  const { calculateSJF } = useSJF();
  const { calculateSTCF } = useSTCF();
  const { calculateRR } = useRR();
  const { calculateMLFQ } = useMLFQ();

  useEffect(() => {
    if (processes.length > 0) {
      if (algorithm === 'all') {
        // Calculate results for all algorithms
        const results = {
          fifo: calculateFIFO(processes),
          sjf: calculateSJF(processes),
          stcf: calculateSTCF(processes),
          rr: calculateRR(processes, settings.timeQuantum),
          mlfq: calculateMLFQ(
            processes,
            settings.timeQuantum,
            settings.priorityLevels
          ),
        };
        setAllResults(results);
        setResult(null);
      } else {
        // Calculate result for single algorithm
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
          case 'rr':
            calculationResult = calculateRR(processes, settings.timeQuantum);
            break;
          case 'mlfq':
            calculationResult = calculateMLFQ(
              processes,
              settings.timeQuantum,
              settings.priorityLevels
            );
            break;
          default:
            calculationResult = calculateFIFO(processes);
        }
        setResult(calculationResult);
        setAllResults(null);
      }
    }
  }, [processes, algorithm, settings]);

  const maxTime = result
    ? result.timeline.reduce((max, block) => Math.max(max, block.endTime), 0)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Visualization</h2>
      </div>

      {processes.length > 0 && (
        <>
          <ProcessTable processes={processes} />

          <AnimatePresence mode="wait">
            {algorithm === 'all' ? (
              <motion.div
                key="comparison"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(allResults || {}).map(
                    ([algoName, algoResult]) => (
                      <div
                        key={algoName}
                        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                      >
                        <h3 className="text-md font-semibold mb-2 capitalize">
                          {algoName}
                        </h3>
                        <div className="space-y-2">
                          <p className="text-sm">
                            Avg Waiting Time:{' '}
                            {algoResult.averageWaitingTime.toFixed(2)}
                          </p>
                          <p className="text-sm">
                            Avg Turnaround Time:{' '}
                            {algoResult.averageTurnaroundTime.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <Graph isComparison={true} allResults={allResults} />
              </motion.div>
            ) : (
              result && (
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

                  <Graph result={result} processes={processes} />
                </motion.div>
              )
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
