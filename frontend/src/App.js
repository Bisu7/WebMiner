import React, { useEffect, useState } from 'react';
import Loader from './components/Loader';
import WebMinerLanding from './components/frontpage';
import ScrapingDashboard from './components/dashboard';

const App = () => {
  const [loading, setLoading] = useState(true);         // For Loader
  const [view, setView] = useState('landing');          // landing | dashboard

  useEffect(() => {
    // Simulate loader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Loader for 1 second
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  if (view === 'landing') return <WebMinerLanding onStart={() => setView('dashboard')} />;

  return <ScrapingDashboard />;
};

export default App;
