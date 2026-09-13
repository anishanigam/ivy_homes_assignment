import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SavedProvider } from './context/SavedContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import RentalsPage from './pages/RentalsPage';
import RentalDetailPage from './pages/RentalDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SavedPage from './pages/SavedPage';
import InsightsPage from './pages/InsightsPage';
import LoginPage from './pages/LoginPage';

// Protects routes to match real API requirement: must log in first
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <SavedProvider>
        <div className="min-h-screen flex flex-col bg-warm-50 text-warm-900 font-sans">
          <Navbar />
          <div className="flex-1">
            <Routes>
              {/* Login Page */}
              <Route path="/login" element={<LoginPage />} />

              {/* All collection and detail routes require login */}
              <Route path="/" element={<ProtectedRoute><ListingsPage /></ProtectedRoute>} />
              <Route path="/listings/:id" element={<ProtectedRoute><ListingDetailPage /></ProtectedRoute>} />
              <Route path="/rentals" element={<ProtectedRoute><RentalsPage /></ProtectedRoute>} />
              <Route path="/rentals/:id" element={<ProtectedRoute><RentalDetailPage /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
              <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
              <Route path="/saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />
              <Route path="/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </SavedProvider>
    </AuthProvider>
  );
}