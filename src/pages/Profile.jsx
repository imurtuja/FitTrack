import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaSave, FaTimes, FaCamera, FaWeight, FaRuler, FaCalendar, FaBell, FaLock, FaTrash, FaUpload, FaCheck, FaBullseye, FaSignOutAlt, FaFire, FaCalendarCheck, FaDumbbell } from 'react-icons/fa';
import { useAuth } from '../App';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import Skeleton from '../components/layout/Skeleton';
import { Helmet } from 'react-helmet-async';

function getInitials(name) {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

const Profile = ({ feedbackOpen, setFeedbackOpen }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [stats, setStats] = useState({ streak: 0, total: 0, last: null });
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [minTimeDone, setMinTimeDone] = useState(false);

  const handleLogout = async () => {
    await signOut(getAuth());
    navigate('/');
  };

  useEffect(() => {
    setLoading(true);
    setMinTimeDone(false);
    const minTimer = setTimeout(() => setMinTimeDone(true), 400);
    if (!user) return;
    const fetchStats = async () => {
      setLoading(true);
      const progressCol = collection(db, 'users', user.uid, 'progress');
      const snap = await getDocs(progressCol);
      const days = [];
      let total = 0;
      snap.forEach(doc => {
        const completed = doc.data().completed || [];
        if (completed.length > 0) {
          days.push(doc.id); // doc.id is the date string
          total += completed.length;
        }
      });
      // Sort days descending
      days.sort((a, b) => b.localeCompare(a));
      // Calculate streak
      let streak = 0;
      let last = days.length > 0 ? days[0] : null;
      if (days.length > 0) {
        let d = new Date(days[0]);
        for (let i = 0; i < days.length; i++) {
          if (days[i] === d.toISOString().split('T')[0]) {
            streak++;
            d.setDate(d.getDate() - 1);
          } else {
            break;
          }
        }
      }
      setStats({ streak, total, last });
      setLoading(false);
        };
    fetchStats();
    return () => clearTimeout(minTimer);
  }, [user]);

  if (!user) return null;

  if (loading || !minTimeDone) {
    return (
      <div className="min-h-screen flex items-center justify-center px-2 pt-24 pb-12 animate-fade-in">
        <Helmet>
          <title>Profile – FitTrack by Murtuja</title>
          <meta name="description" content="View and manage your FitTrack profile. Fitness tracker by Murtuja." />
          <meta name="keywords" content="FitTrack, fitness tracker, profile, Murtuja, health, account" />
          <meta property="og:title" content="Profile – FitTrack by Murtuja" />
          <meta property="og:description" content="View and manage your FitTrack profile. Fitness tracker by Murtuja." />
          <meta property="og:image" content="/dmbbell.png" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://fittrack.vercel.app/profile" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Profile – FitTrack by Murtuja" />
          <meta name="twitter:description" content="View and manage your FitTrack profile. Fitness tracker by Murtuja." />
          <meta name="twitter:image" content="/dmbbell.png" />
        </Helmet>
        <div className="w-full max-w-5xl flex flex-col items-center gap-8 pt-4 pb-8">
          <Skeleton className="w-full max-w-xs h-64 mb-8" />
          <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center mt-2 mb-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="glass-card w-full max-w-xs md:flex-1 min-w-[120px] h-32 md:h-40" />
            ))}
          </div>
          <Skeleton className="w-full max-w-xs h-12 mt-4" />
        </div>
      </div>
    );
  }

  // Debug log for photoURL
  console.log('user.photoURL:', user.photoURL);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 pt-24 pb-12 animate-fade-in">
      <Helmet>
        <title>Profile – FitTrack by Murtuja</title>
        <meta name="description" content="View and manage your FitTrack profile. Fitness tracker by Murtuja." />
        <meta name="keywords" content="FitTrack, fitness tracker, profile, Murtuja, health, account" />
        <meta property="og:title" content="Profile – FitTrack by Murtuja" />
        <meta property="og:description" content="View and manage your FitTrack profile. Fitness tracker by Murtuja." />
        <meta property="og:image" content="/dmbbell.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fittrack.vercel.app/profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Profile – FitTrack by Murtuja" />
        <meta name="twitter:description" content="View and manage your FitTrack profile. Fitness tracker by Murtuja." />
        <meta name="twitter:image" content="/dmbbell.png" />
      </Helmet>
      {/* Dashboard-style hero header block */}
      {/* <div className="w-full max-w-5xl flex flex-col items-center justify-center mb-8 animate-fade-in-up">
        <FaUser className="text-5xl text-[var(--kick-green)] mb-2" />
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[var(--kick-green)] via-[#B0FFB0] to-[var(--kick-green)] bg-clip-text text-transparent drop-shadow-lg text-center mb-2">Profile</h1>
        <div className="h-1 w-40 bg-gradient-to-r from-[var(--kick-green)] to-[#B0FFB0] rounded-full mb-4" />
      </div> */}
      {/* Main card styled like Dashboard/My Routine */}
      <div className="w-full max-w-3xl rounded-3xl glass-card border border-[#23272F] p-0 shadow-2xl animate-dashboard-card relative overflow-hidden" style={{background: 'linear-gradient(135deg, #20232A 80%, #53FC18 100%)'}}>
        {/* Accent bar at top of card */}
        <div className="h-2 w-full bg-gradient-to-r from-[var(--kick-green)] via-[#B0FFB0] to-[#53FC18] mb-2" />
        <div className="p-6 md:p-12 flex flex-col items-center gap-8">
          {/* Profile Info */}
          <div className="flex flex-col items-center gap-2 mb-2">
          <div className="relative mb-2">
            {user.photoURL && !imgError ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[var(--kick-green)] shadow-lg object-cover"
                style={{ boxShadow: '0 0 0 4px #00FF47, 0 2px 16px #00FF4740' }}
                onError={() => setImgError(true)}
              />
              ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#23272F] border-4 border-[var(--kick-green)] flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 0 4px #00FF47, 0 2px 16px #00FF4740' }}>
                <FaUser className="text-4xl md:text-6xl text-[#B0FFB0]" />
                </div>
              )}
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[var(--kick-green)] mb-0.5 md:mb-1 text-center drop-shadow-lg">{user.displayName}</h2>
          <p className="text-[#B0FFB0] text-base md:text-lg mb-1 md:mb-2 text-center font-semibold">{user.email}</p>
        </div>
          {/* Section divider */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#B0FFB0]/30 to-transparent my-2 rounded-full" />
          {/* Stats Row styled as glass cards */}
        <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center mt-2 mb-2">
          <div className="glass-card w-full max-w-xs md:flex-1 min-w-[120px] bg-[#23272F]/70 border border-[#23272F]/40 rounded-xl p-4 md:p-7 flex flex-col items-center text-center shadow-md md:shadow-xl backdrop-blur-md hover:scale-105 transition-transform duration-200 mb-2 md:mb-0">
            <FaFire className="text-2xl md:text-4xl text-[var(--kick-green)] mb-1 md:mb-2 drop-shadow-glow" />
            <span className="text-xl md:text-3xl font-extrabold text-[#F3F3F3]">{stats.streak}</span>
            <span className="text-[#B0FFB0] text-sm md:text-base font-bold mt-0.5 md:mt-1">{t('Day Streak')}</span>
          </div>
          <div className="glass-card w-full max-w-xs md:flex-1 min-w-[120px] bg-[#23272F]/70 border border-[#23272F]/40 rounded-xl p-4 md:p-7 flex flex-col items-center text-center shadow-md md:shadow-xl backdrop-blur-md hover:scale-105 transition-transform duration-200 mb-2 md:mb-0">
            <FaDumbbell className="text-2xl md:text-4xl text-[var(--kick-green)] mb-1 md:mb-2 drop-shadow-glow" />
            <span className="text-xl md:text-3xl font-extrabold text-[#F3F3F3]">{stats.total}</span>
            <span className="text-[#B0FFB0] text-sm md:text-base font-bold mt-0.5 md:mt-1">{t('Total Workouts')}</span>
          </div>
          <div className="glass-card w-full max-w-xs md:flex-1 min-w-[120px] bg-[#23272F]/70 border border-[#23272F]/40 rounded-xl p-4 md:p-7 flex flex-col items-center text-center shadow-md md:shadow-xl backdrop-blur-md hover:scale-105 transition-transform duration-200">
            <FaCalendarCheck className="text-2xl md:text-4xl text-[var(--kick-green)] mb-1 md:mb-2 drop-shadow-glow" />
            <span className="text-xl md:text-3xl font-extrabold text-[#F3F3F3]">{stats.last ? new Date(stats.last).toLocaleDateString() : '--'}</span>
            <span className="text-[#B0FFB0] text-sm md:text-base font-bold mt-0.5 md:mt-1">{t('Last Workout')}</span>
          </div>
        </div>
          {/* Section divider */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#B0FFB0]/30 to-transparent my-2 rounded-full" />
          {/* Logout Button styled like Dashboard/My Routine */}
                  <button
          onClick={handleLogout}
            className="w-full max-w-xs bg-gradient-to-r from-[var(--kick-green)] to-[#53FC18] hover:bg-[var(--kick-green)] text-[#181A20] font-extrabold py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl text-lg md:text-xl flex items-center justify-center gap-3 transition-all duration-150 shadow-lg md:shadow-xl backdrop-blur-lg border border-[#23272F]/60 mt-2"
          style={{ boxShadow: '0 2px 16px #00FF4740' }}
        >
          <FaSignOutAlt className="text-xl md:text-2xl" /> {t('Logout')}
                    </button>
        </div>
      </div>
      {/* Floating Feedback Button (bottom right, only on Profile) */}
      <button
        onClick={() => setFeedbackOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[var(--kick-green)] to-[#53FC18] text-[#181A20] font-extrabold rounded-full px-6 py-4 text-lg shadow-2xl hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-[var(--kick-green)]/40 flex items-center gap-2"
        aria-label="Send Feedback"
      >
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A7.97 7.97 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        Feedback
      </button>
    </div>
  );
};

export default Profile;