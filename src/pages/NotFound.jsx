import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in">
      <h1 className="text-6xl font-extrabold text-[var(--kick-green)] mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Page Not Found</h2>
      <p className="mb-6 text-lg text-gray-400">Sorry, the page you are looking for does not exist or has been moved.</p>
      <Link to="/dashboard" className="px-6 py-3 rounded-full bg-gradient-to-r from-[var(--kick-green)] to-[#53FC18] text-[#181A20] font-bold shadow hover:scale-105 transition-transform">Go to Dashboard</Link>
    </div>
  );
} 