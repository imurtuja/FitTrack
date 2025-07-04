import { useEffect, useState } from 'react';
import { useAuth } from '../../App';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import Skeleton from './Skeleton';

// ProgressCircle component for animated circular progress
const ProgressCircle = ({ completed, total }) => {
  const percent = total > 0 ? (completed / total) * 100 : 0;
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="mx-auto my-4" style={{ transform: 'rotate(-90deg)' }}>
      <circle
        stroke="#23272F"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#53FC18"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.3em"
        fontSize="1.2rem"
        fill="#53FC18"
        fontWeight="bold"
        style={{ transform: 'rotate(90deg)' }}
      >
        {Math.round(percent)}%
      </text>
    </svg>
  );
};

const RightSidebar = () => {
  const { user } = useAuth();
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(1);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayKey = new Date().toISOString().split('T')[0];
    const planRef = doc(db, 'users', user.uid, 'routine', 'plan');
    const progressRef = doc(db, 'users', user.uid, 'progress', todayKey);

    // Listen for routine changes
    const unsubPlan = onSnapshot(planRef, (planSnap) => {
      let todaysTasks = [];
      if (planSnap.exists()) {
        const data = planSnap.data();
        todaysTasks = data[today]?.exercises || [];
      }
      setTotal(todaysTasks.length || 1);
      setLoading(false);
    });

    // Listen for progress changes
    const unsubProgress = onSnapshot(progressRef, (progressSnap) => {
      if (progressSnap.exists()) {
        setCompleted((progressSnap.data().completed || []).length);
      } else {
        setCompleted(0);
      }
    });

    // Timer to force re-render at midnight
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1) - now;
    const midnightTimeout = setTimeout(() => {
      window.location.reload();
    }, msUntilMidnight);

    return () => {
      unsubPlan();
      unsubProgress();
      clearTimeout(midnightTimeout);
    };
  }, [user]);

  // Sample motivational quotes
  const quotes = [
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind that you have to convince.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Fitness is not about being better than someone else. It's about being better than you used to be.",
    "The hardest lift of all is lifting your butt off the couch."
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  if (loading) {
    return (
      <div className="hidden xl:block fixed right-0 top-0 h-full w-96 z-40 flex flex-col gap-8 p-8 animate-fade-in pt-24" style={{background: 'transparent'}}>
        <Skeleton className="glass-card p-8 mb-2 h-64" />
        <Skeleton className="glass-card p-8 mt-2 h-40" />
      </div>
    );
  }

  return (
    <aside className="hidden xl:block fixed right-0 top-0 h-full w-96 z-40 flex flex-col gap-8 p-8 animate-fade-in pt-24" style={{background: 'transparent'}}>
      {/* Progress Widget Card */}
      <div className="glass-card p-8 mb-2 flex flex-col items-center border border-[#23272F]/60 shadow-xl backdrop-blur-lg rounded-2xl relative overflow-hidden" style={{background: 'linear-gradient(135deg, #20232A 80%, #53FC18 100%)'}}>
        {/* Accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[var(--kick-green)] to-[#B0FFB0] rounded-full mb-4" />
        <h3 className="kick-card-title mb-2 text-xl font-extrabold text-[var(--kick-green)]">{t("Today's Progress")}</h3>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Glowing circle behind SVG at 100% */}
            {total > 0 && completed === total && (
              <div
                className="absolute left-1/2 top-1/2 w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                style={{
                  boxShadow: '0 0 32px 8px #53FC18',
                  opacity: 0.35,
                  zIndex: 0,
                }}
              />
            )}
            <svg width="96" height="96" style={{ position: 'relative', zIndex: 1 }}>
              <circle cx="48" cy="48" r="40" stroke="#23272F" strokeWidth="10" fill="none" />
              <circle
                cx="48" cy="48" r="40"
                stroke="url(#kickGreenRight)"
                strokeWidth="10"
                fill="none"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - (total > 0 ? completed / total : 0))}
                strokeLinecap="round"
                transform="rotate(-90 48 48)"
                style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(.4,2,.6,1)' }}
              />
              <defs>
                <linearGradient id="kickGreenRight" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#53FC18" />
                  <stop offset="100%" stopColor="#B0FFB0" />
                </linearGradient>
              </defs>
            </svg>
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-extrabold text-[var(--kick-green)] whitespace-nowrap"
              style={total > 0 && completed === total ? { textShadow: '0 0 16px #53FC18, 0 0 32px #53FC18' } : undefined}
            >
              {Math.round(total > 0 ? (completed / total) * 100 : 0)}%
            </span>
            {/* Confetti at 100% */}
            {total > 0 && completed === total && (
              <img src="https://cdn.jsdelivr.net/gh/fittrack-assets/confetti.gif" alt="Confetti" className="absolute w-32 h-32 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" style={{opacity: 0.9}} onError={e => e.currentTarget.style.display = 'none'} />
            )}
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-bold text-[#B0FFB0]">{t('{{completed}} of {{total}} completed', {completed, total})}</span>
            <span className="text-sm text-[#B0FFB0]">{total > 0 && completed === total ? t('All done! Great job!') : completed > 0 ? t('Keep going!') : t("Let's get started!")}</span>
          </div>
        </div>
      </div>
      {/* Motivation Card */}
      <div className="glass-card p-8 mt-2 border border-[#23272F]/60 shadow-xl backdrop-blur-lg rounded-2xl relative overflow-hidden" style={{background: 'linear-gradient(135deg, #20232A 80%, #53FC18 100%)'}}>
        {/* Accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[var(--kick-green)] to-[#B0FFB0] rounded-full mb-4" />
        <h3 className="kick-card-title mb-2 text-xl font-extrabold text-[var(--kick-green)] flex items-center gap-2"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A7.97 7.97 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> {t('Daily Motivation')}</h3>
        <p className="italic text-[#B0FFB0] text-base animate-quote-fade">"{t(randomQuote)}"</p>
      </div>
    </aside>
  );
};

export default RightSidebar;