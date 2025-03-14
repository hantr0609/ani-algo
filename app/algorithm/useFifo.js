// First In First Out (FIFO) CPU Scheduling Algorithm
export const useFIFO = () => {
  const calculateFIFO = (processes) => {
    if (!processes || processes.length === 0) return null;

    const result = {
      timeline: [],
      waitingTime: [],
      turnaroundTime: [],
      averageWaitingTime: 0,
      averageTurnaroundTime: 0,
    };

    let currentTime = 0;
    const sortedProcesses = [...processes].sort(
      (a, b) => a.arrivalTime - b.arrivalTime
    );

    sortedProcesses.forEach((process, index) => {
      // If there's a gap between current time and process arrival
      if (process.arrivalTime > currentTime) {
        result.timeline.push({
          processId: 'idle',
          startTime: currentTime,
          endTime: process.arrivalTime,
        });
        currentTime = process.arrivalTime;
      }

      // Calculate waiting time
      const waitingTime = Math.max(0, currentTime - process.arrivalTime);
      result.waitingTime[process.id] = waitingTime;

      // Add process execution to timeline
      result.timeline.push({
        processId: process.id,
        startTime: currentTime,
        endTime: currentTime + process.burstTime,
      });

      // Update current time and calculate turnaround time
      currentTime += process.burstTime;
      result.turnaroundTime[process.id] = waitingTime + process.burstTime;
    });

    // Calculate averages
    result.averageWaitingTime =
      result.waitingTime.reduce((acc, time) => acc + time, 0) /
      processes.length;
    result.averageTurnaroundTime =
      result.turnaroundTime.reduce((acc, time) => acc + time, 0) /
      processes.length;

    return result;
  };

  return { calculateFIFO };
};
