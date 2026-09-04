import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Report from './pages/Report';
import AllReports from './pages/AllReports';
import MapView from './pages/MapView';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-orange-50 font-sans text-gray-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/"        element={<Home />} />
            <Route path="/about"   element={<About />} />
            <Route path="/report"  element={<Report />} />
            <Route path="/reports" element={<AllReports />} />
            <Route path="/map"     element={<MapView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
