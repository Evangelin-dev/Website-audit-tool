import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PortalPage from './pages/PortalPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/audit/:taskId" element={<DashboardPage />} />
        <Route path="/portal" element={<PortalPage />} />
      </Routes>
    </Router>
  );
}

export default App;
