// Shortest Time-to-Completion First (STCF) CPU Scheduling Algorithm
export const useSTCF = () => {
  const calculateSTCF = (processes) => {
    if (!processes || processes.length === 0) return null;

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
      startTime: null,
      finishTime: null,
      totalWaitingTime: 0,
    }));

    let currentTime = 0;
    let completedProcesses = [];
    let previousProcess = null;

    while (unfinishedProcesses.length > 0) {
      // Find available processes at current time
      const availableProcesses = unfinishedProcesses.filter(
        (p) => p.arrivalTime <= currentTime
      );

      if (availableProcesses.length === 0) {
        // No processes available, add idle time and jump to next arrival
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

      // Find process with shortest remaining time
      const selectedProcess = availableProcesses.reduce((min, p) =>
        p.remainingTime < min.remainingTime ? p : min
      );

      // Time quantum for STCF (using 1 time unit for preemption)
      const timeQuantum = 1;
      const executionTime = Math.min(
        timeQuantum,
        selectedProcess.remainingTime
      );

      // If we're switching processes, create a new timeline entry
      if (previousProcess !== selectedProcess.id) {
        result.timeline.push({
          processId: selectedProcess.id,
          startTime: currentTime,
          endTime: currentTime + executionTime,
        });
      } else {
        // Extend the last timeline entry
        const lastEntry = result.timeline[result.timeline.length - 1];
        lastEntry.endTime = currentTime + executionTime;
      }

      // Update process state
      selectedProcess.remainingTime -= executionTime;

      // Update waiting time for all other ready processes
      availableProcesses.forEach((p) => {
        if (p.id !== selectedProcess.id) {
          p.totalWaitingTime += executionTime;
        }
      });

      // If process is completed
      if (selectedProcess.remainingTime === 0) {
        const finishTime = currentTime + executionTime;
        const turnaroundTime = finishTime - selectedProcess.arrivalTime;

        // Store results
        result.waitingTime[selectedProcess.id - 1] =
          selectedProcess.totalWaitingTime;
        result.turnaroundTime[selectedProcess.id - 1] = turnaroundTime;

        // Move to completed processes
        completedProcesses.push(selectedProcess);
        unfinishedProcesses = unfinishedProcesses.filter(
          (p) => p.id !== selectedProcess.id
        );
      }

      previousProcess = selectedProcess.id;
      currentTime += executionTime;
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

  return { calculateSTCF };
};
