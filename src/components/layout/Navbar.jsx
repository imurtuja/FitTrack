import { Link } from 'react-router-dom';
import { useAuth } from '../../App';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 flex items-center justify-between px-4 md:px-10 py-2 md:py-3 glass-card bg-[#181A20]/80 backdrop-blur-lg border-b border-[#23272F]/60 shadow-lg" aria-label="Main navigation">
      <Link to="/dashboard" className="flex items-center gap-2 select-none">
        <img src="/dmbbell.svg" alt="Fitmint Logo" className="w-10 h-10 md:w-12 md:h-12 drop-shadow-lg" />
        <span className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[var(--kick-green)] via-[#B0FFB0] to-[var(--kick-green)] bg-clip-text text-transparent tracking-tight drop-shadow-lg">Fitmint</span>
        </Link>
      <div className="flex items-center gap-3">
        {user && (
          <Link to="/profile" className="ml-2">
            <img
              src={user.photoURL || ''}
              alt={user.displayName || 'Profile'}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[var(--kick-green)] object-cover bg-[#23272F] shadow-lg"
              style={{ boxShadow: '0 0 0 3px #00FF47, 0 2px 12px #00FF4740' }}
              onError={e => (e.target.style.display = 'none')}
            />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;