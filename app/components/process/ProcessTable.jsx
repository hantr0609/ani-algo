import { motion } from 'motion/react';

export default function ProcessTable({ processes }) {
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
}
