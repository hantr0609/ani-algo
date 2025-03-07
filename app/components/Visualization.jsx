import MetricCard from './MetricCard';

export default function Visualization() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow">
      <h2 className="text-lg font-semibold mb-4">Visualization</h2>
      <div className="flex gap-4">
        <MetricCard title="Avg Waiting Time" value="6.25" />
        <MetricCard title="Avg Turnaround TIme" value="10.5" />
      </div>
    </div>
  );
}
