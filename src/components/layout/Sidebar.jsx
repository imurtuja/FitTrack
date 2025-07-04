import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaDumbbell, 
  FaUser, 
  FaCalendar, 
  FaSignOutAlt 
} from 'react-icons/fa';
import { useAuth } from '../../App';
import { getAuth, signOut } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/dashboard', icon: <FaHome />, label: t('Dashboard') },
    { path: '/my-routine', icon: <FaCalendar />, label: t('My Routine') },
    { path: '/profile', icon: <FaUser />, label: t('Profile') },
    // Uncomment below if Progress or Settings pages are implemented
    // { path: '/progress', icon: <FaChartLine />, label: 'Progress' },
    // { path: '/settings', icon: <FaCog />, label: 'Settings' },
  ];

  const handleLogout = async () => {
    await signOut(getAuth());
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-20 md:w-72 flex flex-col justify-between z-40 animate-fade-in overflow-y-hidden overflow-x-hidden hidden md:flex glass-card bg-[#181A20]/80 border border-[#23272F]/60 shadow-2xl backdrop-blur-lg" style={{background: 'linear-gradient(135deg, #20232A 80%, #53FC18 100%)'}}>
      {/* Profile Block at Top */}
      <div className="flex flex-col items-center pt-24 pb-4 gap-6 w-full">
        {user && (
          <>
            <div className="relative mb-2">
            <img
              src={user.photoURL || ''}
              alt={user.displayName || 'Profile'}
                className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-[var(--kick-green)] object-cover bg-[#23272F] shadow-lg mt-2 md:mt-4 mb-2 md:mb-4 hover:scale-105 transition-transform"
              style={{ boxShadow: '0 0 0 4px #00FF47, 0 2px 16px #00FF4740' }}
              onError={e => (e.target.style.display = 'none')}
            />
            </div>
            <span className="hidden md:block text-xl font-extrabold bg-gradient-to-r from-[var(--kick-green)] via-[#B0FFB0] to-[var(--kick-green)] bg-clip-text text-transparent text-center mb-2 break-words w-56 drop-shadow-lg">{user.displayName}</span>
            {/* Optionally, add streak or quick status here */}
          </>
        )}
        {/* Section divider */}
        <div className="h-1 w-4/5 bg-gradient-to-r from-transparent via-[#B0FFB0]/30 to-transparent my-2 rounded-full" />
        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 w-full" aria-label="Sidebar navigation">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-0 md:px-8 py-3 rounded-xl font-extrabold text-lg transition-all duration-200 hover:bg-[var(--kick-green)]/90 hover:text-[#181A20] hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--kick-green)] ${isActive(item.path) ? 'bg-[var(--kick-green)] text-[#181A20] shadow-lg scale-105' : 'text-[#F3F3F3]'} justify-center md:justify-start`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
        </div>
      {/* Bottom Section: Logout */}
      {user && (
        <div className="pb-8 px-2 md:px-8 w-full flex flex-col">
          <div className="border-t border-[#23272F]/60 mb-4"></div>
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="w-full flex items-center justify-center gap-2 text-lg font-extrabold bg-gradient-to-r from-[var(--kick-green)] to-[#53FC18] hover:from-[#53FC18] hover:to-[var(--kick-green)] text-[#181A20] rounded-xl py-3 shadow-lg border border-[#23272F]/60 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--kick-green)] hover:scale-105"
            style={{ minHeight: '48px' }}
          >
            <FaSignOutAlt className="text-xl" />
            <span className="hidden md:inline">{t('Logout')}</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;