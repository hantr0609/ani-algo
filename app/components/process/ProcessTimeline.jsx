import { useState } from 'react';
import { motion } from 'motion/react';

export default function ProcessTimeline({ timeline, maxTime, result }) {
  const [hoveredBlock, setHoveredBlock] = useState(null);

  // Calculate process completion times
  const processCompletions = {};
  timeline.forEach((block) => {
    if (block.processId !== 'idle') {
      processCompletions[block.processId] = block.endTime;
    }
  });

  const getProcessColor = (processId) => {
    if (processId === 'idle') return 'bg-gray-300 dark:bg-gray-600';
    // Generate consistent colors for each process
    const colors = [
      'bg-blue-500 dark:bg-blue-600',
      'bg-green-500 dark:bg-green-600',
      'bg-purple-500 dark:bg-purple-600',
      'bg-yellow-500 dark:bg-yellow-600',
      'bg-red-500 dark:bg-red-600',
    ];
    return colors[(parseInt(processId) - 1) % colors.length];
  };

  return (
    <div className="space-y-4">
      <div className="relative h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {Array.from({ length: maxTime + 1 }, (_, i) => (
            <div
              key={i}
              className="absolute h-full w-px bg-gray-200 dark:bg-gray-600"
              style={{ left: `${(i * 100) / maxTime}%` }}
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
              className={`${getProcessColor(
                block.processId
              )} border-l border-r border-white dark:border-gray-800`}
              onMouseEnter={() => setHoveredBlock(block)}
              onMouseLeave={() => setHoveredBlock(null)}
            >
              <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                {block.processId === 'idle' ? 'Idle' : `P${block.processId}`}
              </span>

              {hoveredBlock === block && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                  <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    {block.processId === 'idle' ? (
                      'System Idle'
                    ) : (
                      <>
                        Process {block.processId}
                        <br />
                        Start: {block.startTime}
                        <br />
                        End: {block.endTime}
                        <br />
                        Duration: {block.endTime - block.startTime}
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        <div className="absolute bottom-0 w-full flex text-xs text-gray-500 dark:text-gray-400">
          {Array.from({ length: maxTime + 1 }, (_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${(i * 100) / maxTime}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {i}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2">Process</th>
              <th className="px-4 py-2">Completion Time</th>
              <th className="px-4 py-2">Waiting Time</th>
              <th className="px-4 py-2">Turnaround Time</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processCompletions).map(
              ([processId, completionTime]) => (
                <motion.tr
                  key={processId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`${getProcessColor(
                    processId
                  )} bg-opacity-10 hover:bg-opacity-20`}
                >
                  <td className="px-4 py-2 text-center">P{processId}</td>
                  <td className="px-4 py-2 text-center">{completionTime}</td>
                  <td className="px-4 py-2 text-center">
                    {result.waitingTime[processId]?.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {result.turnaroundTime[processId]?.toFixed(2)}
                  </td>
                </motion.tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
