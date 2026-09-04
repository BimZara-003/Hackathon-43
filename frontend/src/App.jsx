import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Report from './pages/Report';
import AllReports from './pages/AllReports';
import MapView from './pages/MapView';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-orange-50 font-sans text-gray-900">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/report" element={<Report />} />
                <Route path="/reports" element={<AllReports />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
