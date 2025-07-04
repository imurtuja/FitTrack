import './firebase';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import MyRoutine from './pages/MyRoutine';
import LandingPage from './pages/LandingPage';
import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import ErrorBoundary from './components/layout/ErrorBoundary';
import Spinner from './components/layout/Spinner';
import { HelmetProvider } from 'react-helmet-async';
import FeedbackModal from './components/layout/FeedbackModal';
import NotFound from './pages/NotFound';

// Auth context
const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      // Store/update user in Firestore
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userRef, {
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          uid: firebaseUser.uid,
        }, { merge: true });
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/" replace />;
}

// Import CSS
import './App.css'

function AuthLoaderWrapper({ children }) {
  const { loading } = useAuth();
  if (loading) return <Spinner />;
  return children;
}

function App() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <AuthLoaderWrapper>
    <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/profile" element={<Profile feedbackOpen={feedbackOpen} setFeedbackOpen={setFeedbackOpen} />} />
          <Route path="/notes" element={<div className="p-4"><h1 className="text-2xl font-bold">Notes Page</h1><p className="mt-4">This page is under construction.</p></div>} />
          <Route path="/progress" element={<div className="p-4"><h1 className="text-2xl font-bold">Progress Page</h1><p className="mt-4">This page is under construction.</p></div>} />
          <Route path="/calendar" element={<div className="p-4"><h1 className="text-2xl font-bold">Calendar Page</h1><p className="mt-4">This page is under construction.</p></div>} />
          <Route path="/routines" element={<div className="p-4"><h1 className="text-2xl font-bold">Routines Page</h1><p className="mt-4">This page is under construction.</p></div>} />
          <Route path="/diet" element={<div className="p-4"><h1 className="text-2xl font-bold">Diet Page</h1><p className="mt-4">This page is under construction.</p></div>} />
          <Route path="/settings" element={<div className="p-4"><h1 className="text-2xl font-bold">Settings Page</h1><p className="mt-4">This page is under construction.</p></div>} />
                          <Route path="/my-routine" element={<MyRoutine />} />
                          <Route path="*" element={<NotFound />} />
        </Routes>
                        <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
    </Router>
          </AuthLoaderWrapper>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  )
}

export default App
