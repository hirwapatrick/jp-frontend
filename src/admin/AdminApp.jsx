import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import EventForm from './EventForm';
import MediaGrid from './MediaGrid';
import MediaUploader from './MediaUploader';
import TutorialList from './TutorialList';
import TutorialForm from './TutorialForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const session = localStorage.getItem('admin_session');
      const auth = sessionStorage.getItem('admin_authenticated') === 'true'
        || localStorage.getItem('admin_authenticated') === 'true';

      if (!session || auth !== 'true') {
        setIsLoading(false);
        return;
      }

      try {
        const userData = JSON.parse(session);
        if (!userData.token) {
          localStorage.removeItem('admin_session');
          localStorage.removeItem('admin_authenticated');
          sessionStorage.removeItem('admin_authenticated');
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${userData.token}` },
        });

        if (res.ok) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('admin_session');
          localStorage.removeItem('admin_authenticated');
          sessionStorage.removeItem('admin_authenticated');
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        // Keep session on network error to avoid locking user out
        try {
          const userData = JSON.parse(session);
          setUser(userData);
          setIsAuthenticated(true);
        } catch {
          localStorage.removeItem('admin_session');
          localStorage.removeItem('admin_authenticated');
          sessionStorage.removeItem('admin_authenticated');
        }
      }
      setIsLoading(false);
    };

    validateSession();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_email');
    sessionStorage.removeItem('admin_authenticated');
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
      
      {/* Tutorial Management */}
      <Route 
        path="tutorials" 
        element={isAuthenticated ? 
          <TutorialList user={user} /> : 
          <Navigate to="/admin/login" replace />
        } 
      />
      
      <Route 
        path="tutorials/new" 
        element={isAuthenticated ? 
          <TutorialForm user={user} /> : 
          <Navigate to="/admin/login" replace />
        } 
      />
      
      <Route 
        path="tutorials/:tutorialId/edit" 
        element={isAuthenticated ? 
          <TutorialForm user={user} /> : 
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