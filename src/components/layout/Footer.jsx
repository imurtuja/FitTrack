import { useTranslation } from 'react-i18next';
import { FaGlobe, FaHeart } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'hi', label: 'Hindi' },
  { code: 'bn', label: 'Bengali' },
  { code: 'te', label: 'Telugu' },
];

const Footer = () => {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch language from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const lang = userDoc.exists() ? userDoc.data().language : null;
        if (lang && lang !== i18n.language) {
          i18n.changeLanguage(lang);
          localStorage.setItem('fittrack-lang', lang);
        }
      } else {
        // Not logged in, use localStorage or default
        const lang = localStorage.getItem('fittrack-lang') || 'en';
        if (lang !== i18n.language) {
          i18n.changeLanguage(lang);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  const handleLanguageChange = async (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('fittrack-lang', lang);
    if (user) {
      await setDoc(doc(db, 'users', user.uid), { language: lang }, { merge: true });
    }
  };

  return (
    <footer
      className="w-full z-30 bg-gradient-to-r from-[#181A20]/80 via-[#23272F]/80 to-[#181A20]/80 backdrop-blur-lg border-t border-[#23272F]/60 shadow-lg text-[#B0FFB0] text-xs md:text-sm"
      style={{
        boxShadow: '0 4px 32px 0 rgba(0,0,0,0.25)',
        WebkitBackdropFilter: 'blur(8px)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 px-4 md:px-10 py-3">
        {/* Left: Copyright */}
        <div className="flex-1 flex items-center justify-center md:justify-start w-full md:w-auto mb-1 md:mb-0">
          <span>&copy; {new Date().getFullYear()} <span className="font-bold text-[#B0FFB0]">FitTrack</span>. All rights reserved.</span>
        </div>
        {/* Center: Made with love */}
        <div className="flex-1 hidden md:flex items-center justify-center w-full md:w-auto opacity-90">
          <span className="flex items-center gap-1">
            Made with <FaHeart className="text-red-400 inline-block animate-pulse" aria-label="love" /> by <span className="font-semibold">Murtuja</span>
          </span>
        </div>
        {/* Right: Language Switcher */}
        <div className="flex-1 flex items-center justify-center md:justify-end w-full md:w-auto">
          <label htmlFor="footer-lang" className="sr-only">Select language</label>
          <div className="relative flex items-center gap-1">
            <FaGlobe className="text-[#B0FFB0] text-base mr-1" aria-hidden="true" />
            <select
              id="footer-lang"
              value={i18n.language}
              onChange={handleLanguageChange}
              className="bg-[#23272F] text-[#B0FFB0] font-bold rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#B0FFB0] border border-[#23272F] text-sm transition-all hover:border-[#B0FFB0] hover:bg-[#23272F]/90"
              aria-label="Select language"
              disabled={loading}
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 