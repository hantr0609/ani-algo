// Multi-Level Feedback Queue (MLFQ) CPU Scheduling Algorithm
export const useMLFQ = () => {
  const calculateMLFQ = (processes, timeQuantum, priorityLevels) => {
    if (!processes || processes.length === 0 || !timeQuantum || !priorityLevels)
      return null;

    const result = {
      timeline: [],
      waitingTime: Array(processes.length).fill(0),
      turnaroundTime: Array(processes.length).fill(0),
      averageWaitingTime: 0,
      averageTurnaroundTime: 0,
    };

    // Initialize queues for each priority level
    const queues = Array.from({ length: priorityLevels }, () => []);

    // Create a deep copy of processes with additional tracking
    let unfinishedProcesses = processes.map((p) => ({
      ...p,
      remainingTime: p.burstTime,
      currentLevel: 0, // Start at highest priority
      lastExecutionTime: 0,
      quantumRemaining: timeQuantum,
    }));

    let currentTime = 0;
    let completedProcesses = [];

    // Helper function to get time quantum for a priority level
    const getTimeQuantumForLevel = (level) => timeQuantum * Math.pow(2, level);

    // Main scheduling loop
    while (unfinishedProcesses.length > 0 || queues.some((q) => q.length > 0)) {
      // Move arrived processes to highest priority queue
      const newArrivals = unfinishedProcesses.filter(
        (p) => p.arrivalTime <= currentTime
      );
      queues[0].push(...newArrivals);
      unfinishedProcesses = unfinishedProcesses.filter(
        (p) => p.arrivalTime > currentTime
      );

      // Find the highest non-empty priority queue
      let currentLevel = queues.findIndex((queue) => queue.length > 0);

      if (currentLevel === -1) {
        // No processes in any queue, add idle time
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

      // Get the next process to execute
      const currentProcess = queues[currentLevel].shift();
      const levelQuantum = getTimeQuantumForLevel(currentLevel);
      const executeTime = Math.min(levelQuantum, currentProcess.remainingTime);

      // Add to timeline
      result.timeline.push({
        processId: currentProcess.id,
        startTime: currentTime,
        endTime: currentTime + executeTime,
      });

      // Update process state
      currentProcess.remainingTime -= executeTime;

      // Update waiting time
      const waitingSinceLastExecution =
        currentTime - currentProcess.lastExecutionTime;
      if (currentProcess.lastExecutionTime > 0) {
        result.waitingTime[currentProcess.id - 1] += waitingSinceLastExecution;
      }
      currentProcess.lastExecutionTime = currentTime + executeTime;

      // Move time forward
      currentTime += executeTime;

      // Handle process completion or queue demotion
      if (currentProcess.remainingTime > 0) {
        // If process used its full quantum, demote it
        if (executeTime === levelQuantum && currentLevel < priorityLevels - 1) {
          currentProcess.currentLevel = currentLevel + 1;
          queues[currentProcess.currentLevel].push(currentProcess);
        } else {
          // Process was preempted, keep it at the same level
          queues[currentLevel].push(currentProcess);
        }
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

  return { calculateMLFQ };
};
