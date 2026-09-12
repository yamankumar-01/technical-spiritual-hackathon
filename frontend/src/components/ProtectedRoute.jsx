import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-400">Authenticating session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
        state={{ message: 'Please login to access this section.' }}
      />
    );
  }

  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md p-8 rounded-2xl bg-slate-900 border border-rose-500/30 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-white font-['Outfit']">Access Denied</h2>
          <p className="text-sm text-slate-400">
            You do not have administrator permissions to access this portal.
          </p>
          <a
            href="/"
            className="inline-block px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
