import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import Notes from './pages/Notes';
import About from './pages/About';
import Contact from './pages/Contact';
import Announcements from './pages/Announcements';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AdminProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-cyberDeep text-slate-100 selection:bg-neonPurple/40 selection:text-white">
          {/* Header Navigation */}
          <Navbar />
          
          {/* Main Routing Container */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/admin" element={<AdminDashboard />} />
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer Component */}
          <Footer />
        </div>
      </Router>
    </AdminProvider>
  );
}

export default App;
