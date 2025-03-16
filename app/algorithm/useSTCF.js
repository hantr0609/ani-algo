// Shortest Time-to-Completion First (STCF) CPU Scheduling Algorithm
export const useSTCF = () => {
  const calculateSTCF = (processes) => {
    if (!processes || processes.length === 0) return null;

    const result = {
      timeline: [],
      waitingTime: [],
      turnaroundTime: [],
      averageWaitingTime: 0,
      averageTurnaroundTime: 0,
    };

    let currentTime = 0;
    let unfinishedProcesses = [...processes];
    let completedProcesses = [];

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
        currentTime = nextProcess.arrivalTime;
        continue;
      }

      // Select process with shortest remaining burst time
      const selectedProcess = availableProcesses.reduce((min, p) =>
        p.remainingTime < min.remainingTime ? p : min
      );

      // Add idle time to timeline if no process is available
      if (selectedProcess === null) {
        result.timeline.push({
          processId: 'idle',
          startTime: currentTime,
          endTime: currentTime + 1,
        });
        currentTime += 1;
        continue;
      }

      // Update timeline
      result.timeline.push({
        processId: selectedProcess.id,
        startTime: currentTime,
        endTime: currentTime + selectedProcess.remainingTime,
      });

      // Update waiting time
      const waitingTime = currentTime - selectedProcess.arrivalTime;
      result.waitingTime.push(waitingTime);

      // Update turnaround time
      const turnaroundTime = waitingTime + selectedProcess.remainingTime;
      result.turnaroundTime.push(turnaroundTime);

      // Update current time
      currentTime += selectedProcess.remainingTime;

      // Remove completed process
      unfinishedProcesses = unfinishedProcesses.filter(
        (p) => p.id !== selectedProcess.id
      );

      // Add completed process to completed list
      completedProcesses.push(selectedProcess);
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

  return { calculateSTCF };
};
