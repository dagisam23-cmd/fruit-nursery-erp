import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import Dashboard from './pages/Dashboard';
import NurseryManager from './pages/NurseryManager';
import AgronomyCenter from './pages/AgronomyCenter';
import InventoryControl from './pages/InventoryControl';
import ProcurementModule from './pages/ProcurementModule';
import CRMModule from './pages/CRMModule';
import FinanceModule from './pages/FinanceModule';
import HRModule from './pages/HRModule';
import ComplianceCenter from './pages/ComplianceCenter';
import Login from './pages/Login';

// Components
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on app load
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      {isAuthenticated && <Navigation onLogout={handleLogout} userRole={userRole} />}
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/nursery"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <NurseryManager />
            </PrivateRoute>
          }
        />
        <Route
          path="/agronomy"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <AgronomyCenter />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <InventoryControl />
            </PrivateRoute>
          }
        />
        <Route
          path="/procurement"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <ProcurementModule />
            </PrivateRoute>
          }
        />
        <Route
          path="/crm"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <CRMModule />
            </PrivateRoute>
          }
        />
        <Route
          path="/finance"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <FinanceModule />
            </PrivateRoute>
          }
        />
        <Route
          path="/hr"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <HRModule />
            </PrivateRoute>
          }
        />
        <Route
          path="/compliance"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <ComplianceCenter />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
