'use client';

import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

export default function Navbar({
  onProcessesGenerated,
  onAlgorithmChange,
  settings,
  processes,
  result,
  allResults,
}) {
  const [algorithm, setAlgorithm] = useState('fifo');

  function generateProcesses() {
    const newProcesses = Array.from(
      { length: settings.numProcesses },
      (_, index) => ({
        id: index + 1,
        arrivalTime: Math.floor(Math.random() * 10),
        burstTime: Math.floor(Math.random() * 8) + 1,
      })
    );
    onProcessesGenerated(newProcesses);
  }

  const handleAlgorithmChange = (e) => {
    const newAlgorithm = e.target.value;
    setAlgorithm(newAlgorithm);
    onAlgorithmChange(newAlgorithm);
  };

  const downloadResults = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add title
    doc.setFontSize(18);
    doc.text('CPU Scheduling Algorithm Results', pageWidth / 2, 15, {
      align: 'center',
    });

    // Add process table
    doc.setFontSize(14);
    doc.text('Process Information', 14, 25);

    const processHeaders = [['Process ID', 'Arrival Time', 'Burst Time']];
    const processData = processes.map((p) => [
      `P${p.id}`,
      p.arrivalTime,
      p.burstTime,
    ]);

    autoTable(doc, {
      startY: 30,
      head: processHeaders,
      body: processData,
    });

    if (algorithm === 'all') {
      // Compare all algorithms
      const compareHeaders = [
        ['Algorithm', 'Avg Waiting Time', 'Avg Turnaround Time'],
      ];
      const compareData = Object.entries(allResults).map(([name, data]) => [
        name.toUpperCase(),
        data.averageWaitingTime.toFixed(2),
        data.averageTurnaroundTime.toFixed(2),
      ]);

      doc.setFontSize(14);
      doc.text('Algorithm Comparison', 14, doc.lastAutoTable.finalY + 15);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: compareHeaders,
        body: compareData,
      });
    } else {
      // Single algorithm results
      const resultHeaders = [['Process ID', 'Waiting Time', 'Turnaround Time']];
      const resultData = processes.map((p) => [
        `P${p.id}`,
        result.waitingTime[p.id]?.toFixed(2) || '0.00',
        result.turnaroundTime[p.id]?.toFixed(2) || '0.00',
      ]);

      doc.setFontSize(14);
      doc.text(
        `${algorithm.toUpperCase()} Results`,
        14,
        doc.lastAutoTable.finalY + 15
      );

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: resultHeaders,
        body: resultData,
      });

      // Add summary
      doc.setFontSize(12);
      const summaryY = doc.lastAutoTable.finalY + 15;
      doc.text(
        `Average Waiting Time: ${result.averageWaitingTime.toFixed(2)}`,
        14,
        summaryY
      );
      doc.text(
        `Average Turnaround Time: ${result.averageTurnaroundTime.toFixed(2)}`,
        14,
        summaryY + 7
      );
    }

    // Add settings information
    doc.setFontSize(12);
    const settingsY = doc.lastAutoTable.finalY + 25;
    doc.text('Settings:', 14, settingsY);
    doc.text(
      `Number of Processes: ${settings.numProcesses}`,
      14,
      settingsY + 7
    );

    if (algorithm === 'rr' || algorithm === 'mlfq') {
      doc.text(`Time Quantum: ${settings.timeQuantum}`, 14, settingsY + 14);
    }

    if (algorithm === 'mlfq') {
      doc.text(
        `Priority Levels: ${settings.priorityLevels}`,
        14,
        settingsY + 21
      );
    }

    // Save the PDF
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    doc.save(`cpu-scheduling-results-${timestamp}.pdf`);
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
          <option value="rr">Round Robin (RR)</option>
          <option value="mlfq">Multi-Level Feedback Queue (MLFQ)</option>
          <option value="all">Compare All Algorithms</option>
        </select>
        <div className="flex gap-4">
          <button
            onClick={generateProcesses}
            className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Generate Processes
          </button>
          {processes.length > 0 && (result || allResults) && (
            <button
              onClick={downloadResults}
              className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Download Results
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
