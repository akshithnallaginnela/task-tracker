import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Learning from './components/Learning';
import Analytics from './components/Analytics';
import AccountSettings from './components/AccountSettings';
import Layout from './components/Layout';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogin = (user) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentUser(user);
      setIsTransitioning(false);
    }, 300);
  };

  const handleSignup = (user) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentUser(user);
      setIsTransitioning(false);
    }, 300);
  };

  const handleLogout = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      setCurrentUser(null);
      setIsTransitioning(false);
    }, 300);
  };

  const handleSwitchToSignup = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowSignup(true);
      setIsTransitioning(false);
    }, 200);
  };

  const handleSwitchToLogin = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowSignup(false);
      setIsTransitioning(false);
    }, 200);
  };

  if (isTransitioning) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    if (showSignup) {
      return (
        <Signup
          onSignup={handleSignup}
          onSwitchToLogin={handleSwitchToLogin}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onSwitchToSignup={handleSwitchToSignup}
      />
    );
  }

  return (
    <Router>
      <Routes>
        <Route element={<Layout user={currentUser} onLogout={handleLogout} />}>
          <Route path="/" element={<Dashboard user={currentUser} />} />
          <Route path="/dashboard" element={<Dashboard user={currentUser} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<AccountSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
