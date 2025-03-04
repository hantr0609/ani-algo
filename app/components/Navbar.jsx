export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 p-4 shadow-md border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <select className="p-2 rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
          <option value="fifo">First In First Out</option>
          <option value="sjf">Shortest Job First</option>
          <option value="stcf">Shortest Time-to-Completion First</option>
          <option value="rr">Round Robin</option>
          <option value="mlfq">Multi-Level Feedback Queue</option>
        </select>
      </div>
      <div className="flex gap-4">
        <button>Run</button>
        <button>Step</button>
        <button>Reset</button>
      </div>
    </nav>
  );
}
