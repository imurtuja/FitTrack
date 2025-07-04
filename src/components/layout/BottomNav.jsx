import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaDumbbell, FaBook, FaChartLine, FaUser } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const BottomNav = () => {
  const location = useLocation();
  const { t } = useTranslation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 glass-card bg-[#181A20]/90 backdrop-blur-lg border-t border-[#23272F]/60 shadow-2xl rounded-2xl px-2">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/dashboard" 
          className={`flex flex-col items-center justify-center w-full h-full transition-all ${isActive('/dashboard') ? 'text-[var(--kick-green)] font-extrabold' : 'text-[#B0FFB0] font-semibold'}`}
        >
          <FaHome className="text-2xl mb-0.5" />
          <span className="text-sm mt-0.5">{t('Dashboard')}</span>
        </Link>
        <Link 
          to="/my-routine" 
          className={`flex flex-col items-center justify-center w-full h-full transition-all ${isActive('/my-routine') ? 'text-[var(--kick-green)] font-extrabold' : 'text-[#B0FFB0] font-semibold'}`}
        >
          <FaDumbbell className="text-2xl mb-0.5" />
          <span className="text-sm mt-0.5">{t('My Routine')}</span>
        </Link>
        <Link 
          to="/profile" 
          className={`flex flex-col items-center justify-center w-full h-full transition-all ${isActive('/profile') ? 'text-[var(--kick-green)] font-extrabold' : 'text-[#B0FFB0] font-semibold'}`}
        >
          <FaUser className="text-2xl mb-0.5" />
          <span className="text-sm mt-0.5">{t('Profile')}</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;