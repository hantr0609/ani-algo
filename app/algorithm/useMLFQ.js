// Multi-Level Feedback Queue (MLFQ) CPU Scheduling Algorithm
export const useMLFQ = () => {
  const calculateMLFQ = (processes, timeQuantum, priorityLevels) => {
    if (!processes || processes.length === 0) return null;

    const result = {
      timeline: [],
      waitingTime: [],
      turnaroundTime: [],
      averageWaitingTime: 0,
      averageTurnaroundTime: 0,
    };

    const queues = Array.from({ length: priorityLevels }, () => []);
    let currentTime = 0;
    let unfinishedProcesses = [...processes];
    let completedProcesses = [];

    while (unfinishedProcesses.length > 0) {
      // Add processes to appropriate queue based on priority
      for (let i = 0; i < priorityLevels; i++) {
        const availableProcesses = unfinishedProcesses.filter(
          (p) => p.priority === i && p.arrivalTime <= currentTime
        );

        if (availableProcesses.length > 0) {
          queues[i].push(...availableProcesses);
          unfinishedProcesses = unfinishedProcesses.filter(
            (p) => !availableProcesses.includes(p)
          );
        }
      }

      // Process tasks from highest priority queue
      const currentQueue = queues[0];
      if (currentQueue.length > 0) {
        const process = currentQueue.shift();

        // Update timeline
        result.timeline.push({
          processId: process.id,
          startTime: currentTime,
          endTime: currentTime + Math.min(process.remainingTime, timeQuantum),
        });

        // Update waiting time
        const waitingTime = currentTime - process.arrivalTime;
        result.waitingTime.push(waitingTime);

        // Update turnaround time
        const turnaroundTime = waitingTime + process.remainingTime;
        result.turnaroundTime.push(turnaroundTime);

        // Update current time
        currentTime += Math.min(process.remainingTime, timeQuantum);

        // Remove completed process
        completedProcesses.push(process);
      }
    }

    // Calculate average waiting and turnaround times
    const totalWaitingTime = result.waitingTime.reduce(
      (sum, time) => sum + time,
      0
    );
    const totalTurnaroundTime = result.turnaroundTime.reduce(
      (sum, time) => sum + time,
      0
    );

    result.averageWaitingTime = totalWaitingTime / completedProcesses.length;
    result.averageTurnaroundTime =
      totalTurnaroundTime / completedProcesses.length;

    return result;
  };

  return { calculateMLFQ };
};
