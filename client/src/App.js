import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { AuthProvider } from './features/auth/AuthContext';
import Navbar from './components/layout/Navbar';
import { API_URL } from './config';
import ErrorBoundary from './components/common/ErrorBoundary';
import ScrollToTop from './components/layout/ScrollToTop';
import PrivateRoute from './components/routing/PrivateRoute';

// Configure axios to use the backend API URL
axios.defaults.baseURL = API_URL;

// Features (Lazy Loaded)
const HomePage = React.lazy(() => import('./features/dashboard/HomePage'));
const AuthPage = React.lazy(() => import('./features/auth/AuthPage'));
const ForgotPassword = React.lazy(() => import('./features/auth/ForgotPassword'));
const ProfilePage = React.lazy(() => import('./features/profile/ProfilePage'));
const CertificateView = React.lazy(() => import('./features/profile/CertificateView'));
const ScenarioPage = React.lazy(() => import('./features/scenarios/ScenarioPage'));
const TrainingCenter = React.lazy(() => import('./features/training/TrainingCenter'));
const CourseRunnerPage = React.lazy(() => import('./features/training/CourseRunnerPage'));
const AdminPanel = React.lazy(() => import('./features/admin/AdminPanel'));
const NotFoundPage = React.lazy(() => import('./components/common/NotFoundPage'));





const LoadingFallback = () => (
  <div className="loading-screen">
    <div className="loading-spinner"></div>
    <div className="loading-text">Loading System</div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <div className="app-background"></div>

            <Navbar />
            <React.Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ForgotPassword />} />

                {/* Secure Routes */}
                <Route path="/profile/*" element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                } />
                <Route path="/scenarios" element={
                  <PrivateRoute>
                    <ScenarioPage />
                  </PrivateRoute>
                } />
                <Route path="/training/*" element={
                  <PrivateRoute>
                    <TrainingCenter />
                  </PrivateRoute>
                } />
                <Route path="/training/run/:phaseId" element={
                  <PrivateRoute>
                    <CourseRunnerPage />
                  </PrivateRoute>
                } />
                <Route path="/admin" element={
                  <PrivateRoute>
                    <AdminPanel />
                  </PrivateRoute>
                } />

                <Route path="/certificate/:certId" element={<CertificateView />} />

                {/* 404 - Catch All */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </React.Suspense>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
