import Header from '../components/Header';
import Navbar from '../components/Navbar';
import ProcessManagement from '../components/ProcessManagement';
import Visualization from '../components/Visualization';

export default function Home() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <Header />
      <Navbar />
      <main className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProcessManagement />
        <Visualization />
      </main>
    </div>
  );
}
