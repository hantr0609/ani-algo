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

  const { calculateFIFO } = useFIFO();
  const { calculateSJF } = useSJF();
  const { calculateSTCF } = useSTCF();
  const { calculateRR } = useRR();
  const { calculateMLFQ } = useMLFQ();

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
    }
  }, [processes, algorithm, settings]);

  const maxTime =
    result?.timeline.reduce((max, block) => Math.max(max, block.endTime), 0) ||
    0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Visualization</h2>
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

                <Graph result={result} processes={processes} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
