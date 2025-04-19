import React, { useEffect, useState } from 'react';
import Loader from './components/Loader';
import WebMinerLanding from './components/frontpage';
import ScrapingDashboard from './components/dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  const [loading, setLoading] = useState(true); // For Loader

  useEffect(() => {
    // Simulate loader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Loader for 1 second
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WebMinerLanding />} />
        <Route path="/dashboard" element={<ScrapingDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
