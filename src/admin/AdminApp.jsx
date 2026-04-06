import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import EventForm from './EventForm';
import MediaGrid from './MediaGrid';
import MediaUploader from './MediaUploader';

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const session = localStorage.getItem('admin_session');
    const auth = sessionStorage.getItem('admin_authenticated');
    
    if (session && auth === 'true') {
      try {
        const userData = JSON.parse(session);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse session:', error);
        localStorage.removeItem('admin_session');
        sessionStorage.removeItem('admin_authenticated');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    sessionStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_email');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Login route - relative to /admin */}
      <Route 
        path="login" 
        element={!isAuthenticated ? 
          <Login onLogin={handleLogin} /> : 
          <Navigate to="/admin/dashboard" replace />
        } 
      />
      
      {/* Dashboard */}
      <Route 
        path="dashboard" 
        element={isAuthenticated ? 
          <AdminDashboard user={user} onLogout={handleLogout} /> : 
          <Navigate to="/admin/login" replace />
        } 
      />
      
      {/* Event Management */}
      <Route 
        path="events/new" 
        element={isAuthenticated ? 
          <EventForm user={user} /> : 
          <Navigate to="/admin/login" replace />
        } 
      />
      
      <Route 
        path="events/:eventId/edit" 
        element={isAuthenticated ? 
          <EventForm user={user} /> : 
          <Navigate to="/admin/login" replace />
        } 
      />
      
      <Route 
        path="events/:eventId/media" 
        element={isAuthenticated ? 
          <MediaGrid user={user} /> : 
          <Navigate to="/admin/login" replace />
        } 
      />
      
      <Route 
        path="events/:eventId/upload" 
        element={isAuthenticated ? 
          <MediaUploader user={user} /> : 
          <Navigate to="/admin/login" replace />
        } 
      />
      
      {/* Redirect /admin to /admin/dashboard */}
      <Route 
        path="/" 
        element={<Navigate to="/admin/dashboard" replace />} 
      />
      
      {/* Catch all - redirect to dashboard */}
      <Route 
        path="*" 
        element={<Navigate to="/admin/dashboard" replace />} 
      />
    </Routes>
  );
};

export default AdminApp;