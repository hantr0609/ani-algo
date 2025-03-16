// Round Robin (RR) CPU Scheduling Algorithm
export const useRR = () => {
  const calculateRR = (processes, timeQuantum) => {
    if (!processes || processes.length === 0 || !timeQuantum) return null;

    const result = {
      timeline: [],
      waitingTime: Array(processes.length).fill(0),
      turnaroundTime: Array(processes.length).fill(0),
      averageWaitingTime: 0,
      averageTurnaroundTime: 0,
    };

    // Create a deep copy of processes with remaining time
    let unfinishedProcesses = processes.map((p) => ({
      ...p,
      remainingTime: p.burstTime,
      lastExecutionTime: 0,
    }));

    let currentTime = 0;
    let readyQueue = [];
    let completedProcesses = [];

    while (unfinishedProcesses.length > 0 || readyQueue.length > 0) {
      // Add newly arrived processes to ready queue
      const newArrivals = unfinishedProcesses.filter(
        (p) => p.arrivalTime <= currentTime
      );
      readyQueue.push(...newArrivals);
      unfinishedProcesses = unfinishedProcesses.filter(
        (p) => p.arrivalTime > currentTime
      );

      if (readyQueue.length === 0) {
        // No processes in ready queue, add idle time
        const nextArrival = Math.min(
          ...unfinishedProcesses.map((p) => p.arrivalTime)
        );
        result.timeline.push({
          processId: 'idle',
          startTime: currentTime,
          endTime: nextArrival,
        });
        currentTime = nextArrival;
        continue;
      }

      // Get next process from ready queue
      const currentProcess = readyQueue.shift();
      const executeTime = Math.min(timeQuantum, currentProcess.remainingTime);

      // Add to timeline
      result.timeline.push({
        processId: currentProcess.id,
        startTime: currentTime,
        endTime: currentTime + executeTime,
      });

      // Update process state
      currentProcess.remainingTime -= executeTime;

      // Update waiting time for this execution
      const waitingSinceLastExecution =
        currentTime - currentProcess.lastExecutionTime;
      if (currentProcess.lastExecutionTime > 0) {
        // Don't count initial waiting
        result.waitingTime[currentProcess.id - 1] += waitingSinceLastExecution;
      }
      currentProcess.lastExecutionTime = currentTime + executeTime;

      // Move time forward
      currentTime += executeTime;

      // Handle process completion or re-queue
      if (currentProcess.remainingTime > 0) {
        readyQueue.push(currentProcess);
      } else {
        // Process is complete
        result.turnaroundTime[currentProcess.id - 1] =
          currentTime - currentProcess.arrivalTime;
        completedProcesses.push(currentProcess);
      }
    }

    // Calculate averages
    result.averageWaitingTime =
      result.waitingTime.reduce((sum, time) => sum + time, 0) /
      processes.length;
    result.averageTurnaroundTime =
      result.turnaroundTime.reduce((sum, time) => sum + time, 0) /
      processes.length;

    return result;
  };

  return { calculateRR };
};
