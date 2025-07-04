import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import RightSidebar from './RightSidebar';
import Footer from './Footer';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  
  // Progress state for today's workout
  const [progress, setProgress] = useState({ completed: 0, total: 1 });

  // Callback to update progress from child pages
  const updateProgress = (completed, total) => {
    setProgress({ completed, total });
  };

  // Clone children and inject updateProgress as prop
  const childrenWithProps = Array.isArray(children)
    ? children.map(child => child && typeof child.type === 'function' ? 
        { ...child, props: { ...child.props, updateProgress } } : child)
    : children && typeof children.type === 'function'
      ? { ...children, props: { ...children.props, updateProgress } }
      : children;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181A20] via-[#23272F] to-[#181A20] text-text">
      <Navbar />
      <Sidebar />
      {!isProfilePage && <RightSidebar completed={progress.completed} total={progress.total} />}
      
      {/* Main Content */}
      <main className={`pt-2 md:pt-2 pb-16 md:pb-0 md:ml-72 ${!isProfilePage ? 'xl:pr-72' : ''}`}>
        <div className="max-w-7xl mx-auto p-4">
          {childrenWithProps}
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Layout;