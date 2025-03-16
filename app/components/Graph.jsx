'use client';

import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export default function Graph({
  result,
  processes,
  isComparison = false,
  allResults,
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (!isComparison && (!result || !processes)) return;
    if (isComparison && !allResults) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (isComparison) {
      // Comparison view setup
      const labels = ['FIFO', 'SJF', 'STCF', 'RR', 'MLFQ'];
      const avgWaitingTimes = Object.values(allResults).map(
        (r) => r.averageWaitingTime
      );
      const avgTurnaroundTimes = Object.values(allResults).map(
        (r) => r.averageTurnaroundTime
      );

      // Create comparison chart
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Average Waiting Time',
              data: avgWaitingTimes,
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1,
            },
            {
              label: 'Average Turnaround Time',
              data: avgTurnaroundTimes,
              backgroundColor: 'rgba(139, 92, 246, 0.5)',
              borderColor: 'rgb(139, 92, 246)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Algorithm Comparison',
              color: 'rgb(107, 114, 128)',
              font: {
                size: 16,
                weight: 'bold',
              },
            },
            legend: {
              position: 'top',
              labels: {
                color: 'rgb(107, 114, 128)',
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(107, 114, 128, 0.1)',
              },
              ticks: {
                color: 'rgb(107, 114, 128)',
                stepSize: 2,
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: 'rgb(107, 114, 128)',
              },
            },
          },
        },
      });
    } else {
      // Single algorithm view (existing code)
      const labels = processes.map((p) => `P${p.id}`);
      const waitingTimes = result.waitingTime;
      const turnaroundTimes = result.turnaroundTime;

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Waiting Time',
              data: waitingTimes,
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1,
            },
            {
              label: 'Turnaround Time',
              data: turnaroundTimes,
              backgroundColor: 'rgba(139, 92, 246, 0.5)',
              borderColor: 'rgb(139, 92, 246)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Process Metrics',
              color: 'rgb(107, 114, 128)',
              font: {
                size: 16,
                weight: 'bold',
              },
            },
            legend: {
              position: 'top',
              labels: {
                color: 'rgb(107, 114, 128)',
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(107, 114, 128, 0.1)',
              },
              ticks: {
                color: 'rgb(107, 114, 128)',
                stepSize: 2,
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: 'rgb(107, 114, 128)',
              },
            },
          },
        },
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [result, processes, isComparison, allResults]);

  return (
    <div className="mt-6 h-[300px] w-full">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
