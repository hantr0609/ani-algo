export default function ProcessManagement() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow">
      <h2 className="text-lg font-semibold mb-4">Process Management</h2>
      <label className="block mb-2 text-sm font-medium">Time Quantum</label>
      <input
        type="number"
        defaultValue="1"
        min="1"
        className="w-full p-2 mt-1 border rounded-md"
      />

      <label className="block mb-2 mt-5 text-sm font-medium">
        Number of Processes
      </label>
      <select className="w-full p-2 border rounded-md">
        <option value="3">3 Processes</option>
        <option value="4">4 Processes</option>
        <option value="5">5 Processes</option>
        <option value="6">6 Processes</option>
      </select>

      <button className="mt-4 w-full bg-gray-300 p-2 rounded-md">
        Generate Random Processes
      </button>
    </div>
  );
}
