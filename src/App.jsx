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
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/" replace />;
}

// Import CSS
import './App.css'

function App() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes with Layout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile feedbackOpen={feedbackOpen} setFeedbackOpen={setFeedbackOpen} />
                      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-routine"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <MyRoutine />
                      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              {/* Placeholder routes */}
              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="p-4">
                        <h1 className="text-2xl font-bold">Notes Page</h1>
                        <p className="mt-4">This page is under construction.</p>
                      </div>
                      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="p-4">
                        <h1 className="text-2xl font-bold">Progress Page</h1>
                        <p className="mt-4">This page is under construction.</p>
                      </div>
                      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="p-4">
                        <h1 className="text-2xl font-bold">Calendar Page</h1>
                        <p className="mt-4">This page is under construction.</p>
                      </div>
                      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/routines"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="p-4">
                        <h1 className="text-2xl font-bold">Routines Page</h1>
                        <p className="mt-4">This page is under construction.</p>
                      </div>
                      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/diet"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="p-4">
                        <h1 className="text-2xl font-bold">Diet Page</h1>
                        <p className="mt-4">This page is under construction.</p>
                      </div>
                      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="p-4">
                        <h1 className="text-2xl font-bold">Settings Page</h1>
                        <p className="mt-4">This page is under construction.</p>
                      </div>
                      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  )
}

export default App
