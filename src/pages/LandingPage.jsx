import { useNavigate, Navigate } from 'react-router-dom';
import { FaDumbbell, FaChartLine, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Footer from '../components/layout/Footer';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../App';

export default function LandingPage(props) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181A20] via-[#23272F] to-[#181A20] px-4 py-8 relative overflow-x-hidden">
      <Helmet>
        <title>FitTrack – Track. Motivate. Achieve.</title>
        <meta name="description" content="Smash your goals with a modern, powerful fitness tracker. Plan your workouts, stay motivated, and see your progress—anywhere, anytime." />
        <meta property="og:title" content="FitTrack – Track. Motivate. Achieve." />
        <meta property="og:description" content="Smash your goals with a modern, powerful fitness tracker. Plan your workouts, stay motivated, and see your progress—anywhere, anytime." />
        <meta property="og:image" content="/dmbbell.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fittrack.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FitTrack – Track. Motivate. Achieve." />
        <meta name="twitter:description" content="Smash your goals with a modern, powerful fitness tracker. Plan your workouts, stay motivated, and see your progress—anywhere, anytime." />
        <meta name="twitter:image" content="/dmbbell.png" />
      </Helmet>
      {/* Animated/Blurred Background Shapes */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[var(--kick-green)] opacity-20 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-[#53FC18]/30 opacity-10 rounded-full blur-2xl z-0 animate-pulse" />
      {/* Logo & App Name */}
      <header className="flex items-center gap-3 mb-8 select-none z-10">
        <img src="/dmbbell.svg" alt="FitTrack Logo" className="w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
        <span className="text-4xl font-extrabold text-[var(--kick-green)] drop-shadow-lg tracking-tight">FitTrack</span>
      </header>
      <main>
        {/* Hero Section */}
        <div className="glass-card bg-[#181A20]/90 border border-[#23272F] rounded-3xl shadow-2xl p-10 max-w-4xl w-full flex flex-col items-center text-center mb-12 z-10">
          <h1 className="text-4xl pt-2 md:text-6xl font-extrabold bg-gradient-to-r from-[var(--kick-green)] via-[#B0FFB0] to-[var(--kick-green)] bg-clip-text text-transparent mb-4 leading-tight drop-shadow-lg animate-fade-in-up">
            {t('Track. Motivate. Achieve.')}
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-[#B0FFB0] mb-4 animate-fade-in-up delay-100">{t('Your Fitness, Reimagined.')}</h2>
          <p className="text-lg md:text-xl text-[#B0FFB0] mb-8 font-medium animate-fade-in-up delay-200">{t('Smash your goals with a modern, powerful fitness tracker. Plan your workouts, stay motivated, and see your progress—anywhere, anytime.')}</p>
          <button
            onClick={() => navigate('/login')}
            className="group mt-2 bg-gradient-to-r from-[var(--kick-green)] to-[#53FC18] text-[#181A20] font-extrabold rounded-full px-12 py-5 text-2xl shadow-xl hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-[var(--kick-green)]/40 flex items-center gap-4 animate-fade-in-up delay-300"
          >
            {t('Start Your Fitness Journey')}
            <FaArrowRight className="text-2xl group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        {/* Features Section */}
        <section className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center mb-16 z-10">
          <div className="flex-1 glass-card bg-[#23272F]/80 border border-[#23272F] rounded-2xl p-8 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer">
            <FaDumbbell className="text-[var(--kick-green)] text-4xl mb-3" />
            <h3 className="font-bold text-lg mb-1 text-[#F3F3F3]">{t('Personalized Workouts')}</h3>
            <p className="text-[#B0FFB0] text-base">{t('Create, edit, and track your daily routines. Every day, your way.')}</p>
          </div>
          <div className="flex-1 glass-card bg-[#23272F]/80 border border-[#23272F] rounded-2xl p-8 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer">
            <FaChartLine className="text-[var(--kick-green)] text-4xl mb-3" />
            <h3 className="font-bold text-lg mb-1 text-[#F3F3F3]">{t('Progress & Motivation')}</h3>
            <p className="text-[#B0FFB0] text-base">{t('Visualize your progress, get daily motivation, and celebrate your wins.')}</p>
          </div>
          <div className="flex-1 glass-card bg-[#23272F]/80 border border-[#23272F] rounded-2xl p-8 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer">
            <FaCheckCircle className="text-[var(--kick-green)] text-4xl mb-3" />
            <h3 className="font-bold text-lg mb-1 text-[#F3F3F3]">{t('Simple & Powerful')}</h3>
            <p className="text-[#B0FFB0] text-base">{t('Fast, intuitive, and mobile-friendly. Built for real results, not distractions.')}</p>
          </div>
        </section>
      </main>
      <footer className="w-full mt-auto">
        <Footer />
      </footer>
    </div>
  );
} 