export default function MetricCard({ title, value }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md text-center w-full">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-xl font-bold text-indigo-500">{value}</p>
    </div>
  );
}
