import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { FaGoogle, FaApple, FaEnvelope, FaTimes } from 'react-icons/fa';
import { auth, googleProvider, appleProvider, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import '../index.css';
import Layout from '../components/layout/Layout';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Skeleton from '../components/layout/Skeleton';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../App';

export default function Login(props) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { i18n, t } = useTranslation();

  // Only show Apple login in production (not localhost)
  const isProd = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');

  // Helper to fetch and set user language
  const fetchAndSetUserLanguage = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      const lang = userDoc.exists() ? userDoc.data().language : null;
      if (lang) {
        i18n.changeLanguage(lang);
        localStorage.setItem('fittrack-lang', lang);
      }
    } catch (err) {
      // Ignore errors, fallback to default
    }
  };

  const handleProviderLogin = async (provider) => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, provider);
      await fetchAndSetUserLanguage(result.user.uid);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEmailError('');
    setPasswordError('');
    let hasError = false;
    if (!email) {
      setEmailError('Please enter your email.');
      hasError = true;
    }
    if (!password) {
      setPasswordError('Please enter your password.');
      hasError = true;
    }
    if (hasError) {
      setLoading(false);
      return;
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setShowEmailModal(false);
      await fetchAndSetUserLanguage(result.user.uid);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#181A20] via-[#23272F] to-[#181A20] relative overflow-x-hidden animate-fade-in">
      <Helmet>
        <title>Login – Fitmint by Murtuja</title>
        <meta name="description" content="Login to Fitmint by Murtuja. Secure, modern fitness tracker for your workouts and progress." />
        <meta name="keywords" content="Fitmint, fitness tracker, login, Murtuja, health, authentication" />
        <meta property="og:title" content="Login – Fitmint by Murtuja" />
        <meta property="og:description" content="Login to Fitmint by Murtuja. Secure, modern fitness tracker for your workouts and progress." />
        <meta property="og:image" content="/dmbbell.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fitmint.vercel.app/login" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Login – Fitmint by Murtuja" />
        <meta name="twitter:description" content="Login to Fitmint by Murtuja. Secure, modern fitness tracker for your workouts and progress." />
        <meta name="twitter:image" content="/dmbbell.png" />
      </Helmet>
      <Navbar />
      <div className="flex flex-1 items-center justify-center w-full">
        <div className="relative w-full flex flex-col items-center">
          {/* Animated/Blurred Background Shapes */}
          <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[var(--kick-green)] opacity-20 rounded-full blur-3xl z-0 animate-pulse" />
          <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-[#53FC18]/30 opacity-10 rounded-full blur-2xl z-0 animate-pulse" />
          {loading ? (
            <div className="glass-card max-w-xl w-full p-10 mt-8 rounded-3xl border border-[#23272F] flex flex-col items-center z-10 shadow-2xl animate-fade-in-up">
              <Skeleton className="h-12 w-2/3 mb-6" />
              <Skeleton className="h-8 w-3/4 mb-8" />
              <Skeleton className="h-14 w-full mb-4" />
              <Skeleton className="h-14 w-full mb-4" />
            </div>
          ) : (
            <div className="glass-card max-w-xl w-full p-10 mt-8 rounded-3xl border border-[#23272F] flex flex-col items-center z-10 shadow-2xl animate-fade-in-up">
              <h1 className="text-4xl pt-2 font-extrabold bg-gradient-to-r from-[var(--kick-green)] via-[#B0FFB0] to-[var(--kick-green)] bg-clip-text text-transparent mb-3 text-center drop-shadow-lg">{t('login.welcomeBack', 'Welcome Back')}</h1>
              <p className="mb-8 text-[#B0FFB0] text-center text-lg font-medium">{t('login.trackProgress', "Track your progress. Stay motivated. Let's get started!")}</p>
              <div className="flex flex-col gap-4 w-full">
                <button
                  onClick={() => handleProviderLogin(googleProvider)}
                  disabled={loading}
                  className="group flex items-center gap-3 bg-gradient-to-r from-[var(--kick-green)] to-[#53FC18] hover:from-[#53FC18] hover:to-[var(--kick-green)] text-[#181A20] font-extrabold px-10 py-4 rounded-full transition-all duration-200 text-xl focus:outline-none focus:ring-4 focus:ring-[var(--kick-green)]/40 w-full justify-center shadow-xl hover:scale-105 active:scale-95 animate-fade-in-up"
                >
                  <FaGoogle className="text-2xl group-hover:scale-110 transition-transform" />
                  {loading ? t('login.signingIn', 'Signing in...') : t('login.signInWithGoogle', 'Sign in with Google')}
                </button>
                {/* Apple sign-in button removed for now */}
                <button
                  onClick={() => setShowEmailModal(true)}
                  disabled={loading}
                  className="group flex items-center gap-3 bg-gradient-to-r from-[#B0FFB0] to-[var(--kick-green)] hover:from-[var(--kick-green)] hover:to-[#B0FFB0] text-[#181A20] font-extrabold px-10 py-4 rounded-full transition-all duration-200 text-xl focus:outline-none focus:ring-4 focus:ring-[var(--kick-green)]/40 w-full justify-center shadow-xl hover:scale-105 active:scale-95 animate-fade-in-up"
                >
                  <FaEnvelope className="text-2xl group-hover:scale-110 transition-transform" />
                  {t('login.signInWithEmail', 'Sign in with Email')}
                </button>
              </div>
              {error && !showEmailModal && (
                <div className="mt-6 text-red-500 font-semibold animate-fade-in text-center">{t('login.error', error)}</div>
              )}
            </div>
          )}
          {/* Email/Password Modal */}
          {showEmailModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in">
              <div className="glass-card bg-[#181A20]/95 border border-[#23272F] rounded-2xl w-full max-w-lg mx-auto relative overflow-visible p-10 flex flex-col items-center shadow-2xl animate-fade-in-up scale-100 animate-scale-in" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
                <button onClick={() => setShowEmailModal(false)} className="absolute top-4 right-4 text-[#B0FFB0] text-2xl font-bold hover:text-[var(--kick-green)] focus:outline-none z-10 transition-colors"> <FaTimes /> </button>
                <h3 className="text-2xl font-extrabold bg-gradient-to-r from-[var(--kick-green)] via-[#B0FFB0] to-[var(--kick-green)] bg-clip-text text-transparent mb-6 text-center tracking-tight">{t('login.signInWithEmail', 'Sign in with Email')}</h3>
                <form onSubmit={handleEmailLogin} className="flex flex-col gap-6 w-full relative">
                  {/* Email Input with Right-Side Tooltip Error */}
                  <div className="flex flex-col gap-1 relative">
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder={t('login.email', 'Email')}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className={`glass-card bg-[#23272F]/80 text-[#F3F3F3] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[var(--kick-green)] border transition-all text-base placeholder-[#B0FFB0] w-full ${emailError ? 'border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.2)]' : 'border-[#23272F]'}`}
                        autoFocus
                      />
                      {emailError && (
                        <div className="absolute z-20 animate-fade-in"
                          style={{
                            left: '100%',
                            marginLeft: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            minWidth: '180px',
                            maxWidth: '260px',
                            whiteSpace: 'normal',
                          }}
                        >
                          <div className="relative bg-[#23272F]/90 border border-red-400 text-red-200 rounded-lg px-4 py-2 shadow-lg flex items-center gap-2 text-sm font-semibold">
                            <span className="text-lg">⚠️</span> {t('login.emailError', emailError)}
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-[#23272F]/90"></div>
                          </div>
                        </div>
                      )}
                      {/* On small screens, show tooltip below input */}
                      {emailError && (
                        <div className="md:hidden absolute left-0 right-0 top-full mt-2 z-20 animate-fade-in flex justify-center">
                          <div className="relative bg-[#23272F]/90 border border-red-400 text-red-200 rounded-lg px-4 py-2 shadow-lg flex items-center gap-2 text-sm font-semibold">
                            <span className="text-lg">⚠️</span> {t('login.emailError', emailError)}
                            <div className="absolute left-1/2 -top-2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-[#23272F]/90"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 relative">
                    <div className="relative flex items-center">
                      <input
                        type="password"
                        placeholder={t('login.password', 'Password')}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={`glass-card bg-[#23272F]/80 text-[#F3F3F3] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[var(--kick-green)] border transition-all text-base placeholder-[#B0FFB0] w-full ${passwordError ? 'border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.2)]' : 'border-[#23272F]'}`}
                      />
                      {passwordError && (
                        <div className="absolute z-20 animate-fade-in"
                          style={{
                            left: '100%',
                            marginLeft: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            minWidth: '180px',
                            maxWidth: '260px',
                            whiteSpace: 'normal',
                          }}
                        >
                          <div className="relative bg-[#23272F]/90 border border-red-400 text-red-200 rounded-lg px-4 py-2 shadow-lg flex items-center gap-2 text-sm font-semibold">
                            <span className="text-lg">⚠️</span> {t('login.passwordError', passwordError)}
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-[#23272F]/90"></div>
                          </div>
                        </div>
                      )}
                      {/* On small screens, show tooltip below input */}
                      {passwordError && (
                        <div className="md:hidden absolute left-0 right-0 top-full mt-2 z-20 animate-fade-in flex justify-center">
                          <div className="relative bg-[#23272F]/90 border border-red-400 text-red-200 rounded-lg px-4 py-2 shadow-lg flex items-center gap-2 text-sm font-semibold">
                            <span className="text-lg">⚠️</span> {t('login.passwordError', passwordError)}
                            <div className="absolute left-1/2 -top-2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-[#23272F]/90"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[var(--kick-green)] to-[#53FC18] hover:from-[#53FC18] hover:to-[var(--kick-green)] text-[#181A20] font-extrabold px-7 py-3 rounded-xl transition-transform text-base mt-2 shadow-lg hover:scale-105 active:scale-95"
                  >
                    {loading ? t('login.signingIn', 'Signing in...') : t('login.signIn', 'Sign in')}
                  </button>
                  {error && (
                    <div className="relative flex justify-center mt-4 animate-fade-in">
                      <div className="bg-[#23272F]/90 border border-red-400 text-red-200 rounded-lg px-4 py-2 shadow-lg flex items-center gap-2 text-sm font-semibold whitespace-nowrap">
                        <span className="text-lg">⚠️</span> {t('login.error', error)}
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
} 