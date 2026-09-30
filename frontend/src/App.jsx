import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggleFloating from './components/ThemeToggleFloating';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PSPage from './pages/PSPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeamRegisterPage from './pages/TeamRegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SoftMedicalGlassDemo from './pages/SoftMedicalGlassDemo';

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const isDesignSystem = location.pathname === '/design-system' || location.pathname === '/soft-glass';

  if (isDesignSystem) {
    return (
      <Routes>
        <Route path="/design-system" element={<SoftMedicalGlassDemo />} />
        <Route path="/soft-glass" element={<SoftMedicalGlassDemo />} />
      </Routes>
    );
  }

  const isAdminRoute = location.pathname.startsWith('/admin');
  const hideFooter = isAdminRoute || user?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col relative text-slate-900 font-sans transition-colors duration-300 selection:bg-[#bae6fd] selection:text-[#0369a1] bg-white">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow w-full bg-white">
        <Routes>
          {/* Public Marketing & Educational Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/ps" element={<PSPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Team Registration Wizard */}
          <Route
            path="/register-team"
            element={
              <ProtectedRoute>
                <TeamRegisterPage />
              </ProtectedRoute>
            }
          />

          {/* Authenticated User Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Control Hub */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
      <ThemeToggleFloating />
    </div>
  </div>
);
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
