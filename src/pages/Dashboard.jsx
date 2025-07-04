import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FaDumbbell, FaCheck, FaQuoteLeft, FaStickyNote, FaUserCircle, FaFire, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Skeleton from '../components/layout/Skeleton';
import { Helmet } from 'react-helmet-async';

const quotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "The hardest lift of all is lifting your butt off the couch."
];

function getTodayKey() {
  const today = new Date();
  return today.toISOString().split('T')[0]; // e.g. 2025-06-30
}

function getTodayName() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [note, setNote] = useState('');
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState('');
  const { t } = useTranslation();
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(note);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(0); // Placeholder for streak logic

  // Load today's plan from My Routine
  useEffect(() => {
    if (!user) return;
    const fetchRoutine = async () => {
      setLoading(true);
      const planRef = doc(db, 'users', user.uid, 'routine', 'plan');
      const snap = await getDoc(planRef);
      if (snap.exists()) {
        const data = snap.data();
        const today = getTodayName();
        setTasks(data[today]?.exercises || []);
        setNote(data[today]?.note || '');
      } else {
        setTasks([]);
        setNote('');
      }
      setLoading(false);
    };
    fetchRoutine();
  }, [user]);

  // Load today's completion from Firestore
  useEffect(() => {
    if (!user) return;
    const fetchCompletion = async () => {
      const todayKey = getTodayKey();
      const ref = doc(db, 'users', user.uid, 'progress', todayKey);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setCompleted(snap.data().completed || []);
      } else {
        setCompleted([]);
      }
    };
    fetchCompletion();
  }, [user, tasks]);

  // Save completion to Firestore
  const saveCompletion = async (newCompleted) => {
    if (!user) return;
    const todayKey = getTodayKey();
    const ref = doc(db, 'users', user.uid, 'progress', todayKey);
    await setDoc(ref, { completed: newCompleted }, { merge: true });
  };

  const handleToggle = async (idx) => {
    let newCompleted;
    if (completed.includes(idx)) {
      newCompleted = completed.filter(i => i !== idx);
    } else {
      newCompleted = [...completed, idx];
    }
    setCompleted(newCompleted);
    await saveCompletion(newCompleted);
  };

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // Streak logic (placeholder: set to 5 for demo)
  useEffect(() => {
    setStreak(5); // Replace with real logic if available
  }, []);

  // Confetti when all complete
  useEffect(() => {
    if (tasks.length > 0 && completed.length === tasks.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
  }, [completed, tasks]);

  const handleNoteEdit = () => {
    setNoteDraft(note);
    setEditingNote(true);
  };
  const handleNoteSave = async () => {
    setEditingNote(false);
    setNote(noteDraft);
    // Save to Firestore
    if (user) {
      const today = getTodayName();
      const planRef = doc(db, 'users', user.uid, 'routine', 'plan');
      const snap = await getDoc(planRef);
      if (snap.exists()) {
        const data = snap.data();
        data[today] = { ...data[today], note: noteDraft };
        await setDoc(planRef, data, { merge: true });
      }
    }
  };
  const handleNoteCancel = () => {
    setEditingNote(false);
    setNoteDraft(note);
  };

  // Personalized greeting
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const percent = tasks.length > 0 ? (completed.length / tasks.length) * 100 : 0;

  return (
    <div className="min-h-screen px-2 pt-24 pb-24 flex flex-col items-center ">
      <Helmet>
        <title>Dashboard – Fitmint by Murtuja</title>
        <meta name="description" content="Your personalized fitness dashboard. Track your workouts, progress, and motivation with Fitmint by Murtuja." />
        <meta name="keywords" content="Fitmint, fitness tracker, workout, dashboard, Murtuja, progress, motivation, exercise, health" />
        <meta property="og:title" content="Dashboard – Fitmint by Murtuja" />
        <meta property="og:description" content="Your personalized fitness dashboard. Track your workouts, progress, and motivation with Fitmint by Murtuja." />
        <meta property="og:image" content="/dmbbell.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fitmint.vercel.app/dashboard" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dashboard – Fitmint by Murtuja" />
        <meta name="twitter:description" content="Your personalized fitness dashboard. Track your workouts, progress, and motivation with Fitmint by Murtuja." />
        <meta name="twitter:image" content="/dmbbell.png" />
      </Helmet>
      {/* Professional header block */}
      <div className="w-full max-w-5xl flex flex-col items-center justify-center mb-8 animate-fade-in-up">
        <FaUserCircle className="text-5xl text-[var(--kick-green)] mb-2" />
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#F3F3F3] drop-shadow text-center mb-1">
          {greeting()}, <span className="text-[var(--kick-green)]">{user?.displayName || 'User'}</span>!
        </h2>
        {streak > 1 && (
          <div className="flex items-center gap-2 mt-1 text-lg text-[#B0FFB0] font-semibold animate-fade-in text-center mb-2">
            <FaFire className="text-xl text-[var(--kick-green)]" />
            <span>Streak: <span className="text-[var(--kick-green)] font-bold">{streak}</span> days in a row!</span>
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[var(--kick-green)] via-[#B0FFB0] to-[var(--kick-green)] bg-clip-text text-transparent drop-shadow-lg text-center mt-2 mb-2">{t("Today's Workout")}</h1>
        <div className="h-1 w-40 bg-gradient-to-r from-[var(--kick-green)] to-[#B0FFB0] rounded-full mb-2" />
      </div>
      <div className="w-full max-w-5xl rounded-3xl glass-card border border-[#23272F] p-0 shadow-2xl animate-dashboard-card relative overflow-hidden" style={{background: 'linear-gradient(135deg, #20232A 80%, #53FC18 100%)'}}>
        {/* Accent bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[var(--kick-green)] via-[#B0FFB0] to-[#53FC18] mb-2" />
        <div className="p-4 md:p-8 flex flex-col gap-4 md:gap-6">
          {/* Notes for today heading with icon and accent */}
          <div className="flex items-center gap-2 mb-1">
            <FaStickyNote className="text-2xl text-[var(--kick-green)]" />
            <span className="text-xl md:text-2xl font-extrabold text-[var(--kick-green)]">{t('Notes for today')}</span>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-[var(--kick-green)] to-[#B0FFB0] rounded-full mb-2" />
          {/* Editable notes */}
          {editingNote ? (
            <div className="flex items-center gap-2 w-full">
              <input
                className="w-full bg-[#23272F]/80 text-[#B0FFB0] rounded-xl p-4 min-h-[40px] font-medium shadow-inner border-2 border-[var(--kick-green)] focus:outline-none focus:ring-2 focus:ring-[var(--kick-green)] text-lg"
                value={noteDraft}
                onChange={e => setNoteDraft(e.target.value)}
                autoFocus
              />
              <button onClick={handleNoteSave} className="p-3 rounded-full bg-[var(--kick-green)] text-[#181A20] hover:bg-[#B0FFB0] transition shadow" aria-label="Save Note"><FaSave /></button>
              <button onClick={handleNoteCancel} className="p-3 rounded-full bg-[#23272F] text-[#B0FFB0] hover:bg-[#181A20] transition shadow" aria-label="Cancel Edit"><FaTimes /></button>
            </div>
          ) : (
            <div className="w-full bg-[#23272F]/80 text-[#B0FFB0] rounded-xl p-4 min-h-[40px] font-medium shadow-inner text-lg flex items-center justify-between">
              <span>{note || t('No notes for today.')}</span>
              <button onClick={handleNoteEdit} className="ml-4 p-2 rounded-full bg-[#23272F] text-[var(--kick-green)] hover:bg-[#181A20] transition shadow" aria-label="Edit Note"><FaStickyNote /></button>
            </div>
          )}
        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
          <FaDumbbell className="text-[var(--kick-green)] text-2xl" />
          <h2 className="text-2xl font-extrabold text-[#F3F3F3] tracking-tight">{t('Workout Checklist')}</h2>
        </div>
        {/* Progress Bar: show only on mobile */}
        <div className="block md:hidden mb-3">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 flex items-center justify-center mb-2">
              <svg className="absolute top-0 left-0 z-0" width="96" height="96" style={percent === 100 ? { filter: 'drop-shadow(0 0 16px #53FC18)' } : {}}>
                <circle cx="48" cy="48" r="40" stroke="#23272F" strokeWidth="10" fill="none" />
                <circle
                  cx="48" cy="48" r="40"
                  stroke="url(#kickGreenMobile)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - percent / 100)}
                  strokeLinecap="round"
                  transform="rotate(-90 48 48)"
                  style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(.4,2,.6,1)', stroke: percent === 0 ? '#53FC18' : undefined }}
                />
                <defs>
                  <linearGradient id="kickGreenMobile" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#53FC18" />
                    <stop offset="100%" stopColor="#B0FFB0" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-[var(--kick-green)]" style={percent === 100 ? { textShadow: '0 0 8px #53FC18' } : {}}>{Math.round(percent)}%</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-lg font-bold text-[#B0FFB0]">{t('{{completed}} of {{tasks}} completed', {completed: completed.length, tasks: tasks.length})}</span>
              <span className="text-sm text-[#B0FFB0]">{percent === 100 ? t('All done! Great job!') : percent > 0 ? t('Keep going!') : t("Let's get started!")}</span>
            </div>
              </div>
              </div>
        <hr className="border-[#23272F] my-1 md:my-2" />
        {loading ? (
          <div className="space-y-6">
            {/* Notes skeleton */}
              <div>
              <div className="block text-base font-bold mb-1 text-[var(--kick-green)]">&nbsp;</div>
              <Skeleton className="w-full h-10 mb-2" />
              </div>
            {/* Checklist skeleton */}
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
            {/* Quote skeleton */}
            <Skeleton className="h-10 w-full mt-6" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <span className="text-6xl mb-4">💪</span>
            <span className="text-lg text-[#B0FFB0] mb-6 text-center">No workouts yet! Start your journey by adding your first workout.</span>
            <a href="/my-routine" className="mt-2 bg-gradient-to-r from-[var(--kick-green)] to-[#53FC18] text-[#181A20] font-extrabold rounded-full px-10 py-4 text-xl shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-transform">
              <FaDumbbell className="text-2xl" /> Add Workout
            </a>
          </div>
          ) : (
          <ul className="space-y-2 md:space-y-3 mb-1 md:mb-2">
            {tasks.map((task, idx) => (
                <li key={idx} className={`flex items-center justify-between glass-card bg-[#181A20]/90 border border-[#23272F] rounded-2xl p-2 md:p-3 group transition-all shadow-lg ${completed.includes(idx) ? 'opacity-40 grayscale' : 'hover:bg-[#23272F]/95 hover:scale-[1.02] hover:shadow-[0_2px_16px_0_#53FC18]/20'} animate-checklist-item`}>
                  <div className="flex items-center gap-3 w-full">
                    <FaDumbbell className="text-lg text-[var(--kick-green)]" />
                  <button 
                    onClick={() => handleToggle(idx)}
                      className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors text-2xl font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--kick-green)] ${completed.includes(idx) ? 'bg-[var(--kick-green)] border-[var(--kick-green)] scale-110 shadow-[0_0_8px_2px_#53FC18] animate-check' : 'bg-[#23272F] border-[#B0FFB0] hover:scale-110'}`}
                      style={{ minWidth: '40px', minHeight: '40px', transition: 'all 0.2s cubic-bezier(.4,2,.6,1)' }}
                      aria-label={completed.includes(idx) ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                      {completed.includes(idx) && <FaCheck className="text-[#181A20] text-2xl animate-checkmark" />}
                  </button>
                  <div className="flex flex-col justify-center w-full">
                    <span className={`font-extrabold text-base md:text-lg transition-all ${completed.includes(idx) ? 'line-through text-[#B0FFB0]' : 'text-[#F3F3F3] group-hover:text-[var(--kick-green)]'}`}>{task.name}</span>
                    <span className="ml-0 md:ml-2 text-sm md:text-base text-[#B0FFB0]">{t('{{sets}} sets × {{reps}} reps', {sets: task.sets, reps: task.reps})}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          )}
        </div>
      </div>
      {/* Motivation Card */}
      <div className="w-full max-w-xs md:max-w-sm mt-8 glass-card border border-[#23272F] rounded-2xl p-6 shadow-xl animate-fade-in-up flex flex-col items-center gap-3 bg-[#181A20]/80 relative overflow-hidden" style={{backdropFilter: 'blur(6px)'}}>
        <FaQuoteLeft className="text-[var(--kick-green)] text-2xl mb-2 animate-quote-fade" />
        <span className="text-lg text-[#B0FFB0] text-center animate-quote-fade" key={quote}>{`"${quote}"`}</span>
      </div>
    </div>
  );
}