import React, { useEffect, useState } from 'react';
import Loader from './components/Loader';
import WebMinerLanding from './components/frontpage';
import ScrapingDashboard from './components/dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  const [loading, setLoading] = useState(true); // For Loader
  const [user,setUser] = useState(null);

  useEffect(() => {
    // Simulate loader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Loader for 1 second
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if(savedUser) setUser(savedUser);
  },[]);

  if (loading) return <Loader />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WebMinerLanding setUser={setUser} />} />
        <Route path="/dashboard" element={<ScrapingDashboard user={user} setUser={setUser} />} />
      </Routes>
    </Router>
  );
};

export default App;
