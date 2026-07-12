import React, { useEffect, useState } from 'react';
import { Layers, Calendar, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import EventCard from '../components/EventCard';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // All, Hackathons, ESports
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/events');
      setEvents(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Could not connect to database. Ensure MongoDB is running and Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Events & Hackathons - Tagda Tech";
    fetchEvents();
  }, []);

  // Update interaction joins locally in state
  const handleJoined = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.map((evt) =>
        evt._id === eventId ? { ...evt, interactions: evt.interactions + 1 } : evt
      )
    );
  };

  // Filter events by tab type
  const filteredEvents = events.filter((evt) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Hackathons') return evt.type === 'Hackathon';
    if (activeTab === 'ESports') return evt.type === 'ESports';
    return true;
  });

  // Separate upcoming vs past
  const now = new Date();
  const upcomingEvents = filteredEvents.filter((evt) => new Date(evt.date) >= now);
  const pastEvents = filteredEvents.filter((evt) => new Date(evt.date) < now);

  const tabs = ['All', 'Hackathons', 'ESports'];

  return (
    <div className="min-h-screen py-12 relative">
      <div className="absolute top-10 right-10 w-80 h-80 bg-neonPurple/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neonPurple/10 pb-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold font-cyber tracking-wider text-white">COMMUNITY EVENTS</h1>
            <p className="text-slate-400 text-sm">Challenge yourself in developer sprints and esports match brackets.</p>
          </div>

          {/* Tab Filters */}
          <div className="flex items-center bg-cyberDark border border-neonPurple/25 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md font-cyber text-xs sm:text-sm tracking-wider font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-neonPurple text-white shadow-cyber-neon/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'ESports' ? 'E-Sports' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCw className="h-8 w-8 text-neonMagenta animate-spin" />
            <p className="text-slate-500 font-cyber text-sm tracking-widest">LOADING GRIDS...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-cyberDark/50 border border-red-500/20 rounded-xl max-w-lg mx-auto p-6 space-y-4">
            <p className="text-red-400 font-sans">{error}</p>
            <button 
              onClick={fetchEvents}
              className="cyber-btn-secondary py-2 px-4 mx-auto text-xs"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* 1. Upcoming Events Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-neonMagenta">
                <Layers className="h-5 w-5" />
                <h2 className="text-xl font-bold tracking-widest font-cyber">ACTIVE & UPCOMING EVENTS ({upcomingEvents.length})</h2>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="border border-dashed border-neonPurple/20 bg-cyberDark/30 rounded-xl py-12 text-center text-slate-500 font-sans">
                  No upcoming {activeTab !== 'All' ? activeTab.toLowerCase() : ''} events scheduled at the moment. Check back soon!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {upcomingEvents.map((event) => (
                      <EventCard 
                        key={event._id} 
                        event={event} 
                        onJoined={handleJoined} 
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* 2. Past Events Section */}
            {pastEvents.length > 0 && (
              <div className="space-y-6 pt-8 border-t border-neonPurple/10">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="h-5 w-5" />
                  <h2 className="text-xl font-bold tracking-widest font-cyber">PAST COMMUNITY MATCHES ({pastEvents.length})</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-75 hover:opacity-100 transition-opacity duration-300">
                  {pastEvents.map((event) => (
                    <EventCard 
                      key={event._id} 
                      event={event} 
                      onJoined={handleJoined} 
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
