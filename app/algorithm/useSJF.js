// Shortest Job First (SJF) CPU Scheduling Algorithm
export const useSJF = () => {
  const calculateSJF = (processes) => {
    if (!processes || processes.length === 0) return null;

    const result = {
      timeline: [],
      waitingTime: [],
      turnaroundTime: [],
      averageWaitingTime: 0,
      averageTurnaroundTime: 0,
    };

    let currentTime = 0;
    const unfinishedProcesses = [...processes];
    const completedProcesses = [];

    while (unfinishedProcesses.length > 0) {
      // Find available processes at current time
      const availableProcesses = unfinishedProcesses.filter(
        (p) => p.arrivalTime <= currentTime
      );

      if (availableProcesses.length === 0) {
        // No processes available, find next arrival time
        const nextProcess = unfinishedProcesses.reduce((min, p) =>
          p.arrivalTime < min.arrivalTime ? p : min
        );

        // Add idle time to timeline
        result.timeline.push({
          processId: 'idle',
          startTime: currentTime,
          endTime: nextProcess.arrivalTime,
        });
        currentTime = nextProcess.arrivalTime;
        continue;
      }

      // Find shortest job among available processes
      const shortestJob = availableProcesses.reduce((min, p) =>
        p.burstTime < min.burstTime ? p : min
      );

      // Calculate waiting time
      const waitingTime = currentTime - shortestJob.arrivalTime;
      result.waitingTime[shortestJob.id] = waitingTime;

      // Add process execution to timeline
      result.timeline.push({
        processId: shortestJob.id,
        startTime: currentTime,
        endTime: currentTime + shortestJob.burstTime,
      });

      // Update current time and calculate turnaround time
      currentTime += shortestJob.burstTime;
      result.turnaroundTime[shortestJob.id] =
        waitingTime + shortestJob.burstTime;

      // Move process from unfinished to completed
      const processIndex = unfinishedProcesses.findIndex(
        (p) => p.id === shortestJob.id
      );
      completedProcesses.push(...unfinishedProcesses.splice(processIndex, 1));
    }

    // Calculate averages
    result.averageWaitingTime =
      result.waitingTime.reduce((acc, time) => acc + time, 0) /
      processes.length;
    result.averageTurnaroundTime =
      result.turnaroundTime.reduce((acc, time) => acc + time, 0) /
      processes.length;

    return result;
  };

  return { calculateSJF };
};
