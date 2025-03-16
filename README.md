This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/hantr0609/cpu-scheduling-visualization.git
cd cpu-scheduling-visualization
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Algorithm Details

### FIFO (First In First Out)

- Processes are executed in the order they arrive
- Non-preemptive scheduling
- Simple implementation but may lead to convoy effect

### SJF (Shortest Job First)

- Selects process with shortest burst time
- Non-preemptive scheduling
- Optimal for minimizing average waiting time

### STCF (Shortest Time to Completion First)

- Preemptive version of SJF
- Switches to shorter processes that arrive
- Optimal for minimizing average response time

### RR (Round Robin)

- Time-sharing algorithm
- Each process gets a fixed time quantum
- Fair distribution of CPU time

### MLFQ (Multi-Level Feedback Queue)

- Multiple priority queues
- Dynamic priority adjustment
- Balances throughput and response time

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Operating Systems course materials
- Built for educational purposes
