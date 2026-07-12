import React, { useEffect, useState } from 'react';
import { Megaphone, AlertCircle, RefreshCw, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
      setError('Could not download community updates. Retry again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      <div className="absolute top-10 left-1/3 w-80 h-80 bg-neonPurple/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Header section */}
        <div className="border-b border-neonPurple/10 pb-6 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold font-cyber tracking-wider text-white">COMMUNITY UPDATES</h1>
          <p className="text-slate-400 text-sm">Priority alerts, timeline announcements, and event schedule releases.</p>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCw className="h-8 w-8 text-neonMagenta animate-spin" />
            <p className="text-slate-500 font-cyber text-sm tracking-widest">CONNECTING TIMELINE...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-cyberDark/50 border border-red-500/20 rounded-xl max-w-lg mx-auto p-6 space-y-4">
            <p className="text-red-400 font-sans">{error}</p>
            <button 
              onClick={fetchAnnouncements}
              className="cyber-btn-secondary py-2 px-4 mx-auto text-xs"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <h2 className="text-lg font-cyber font-bold tracking-widest text-neonMagenta flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              TIMELINE BULLETIN ({announcements.length})
            </h2>

            {announcements.length === 0 ? (
              <div className="border border-dashed border-neonPurple/20 bg-cyberDark/30 rounded-xl py-16 text-center text-slate-500 font-sans">
                No active announcements on the board right now. Check back later!
              </div>
            ) : (
              <div className="relative border-l border-neonPurple/20 ml-4 pl-6 md:pl-8 space-y-8 py-2">
                {announcements.map((ann, idx) => {
                  const annDate = new Date(ann.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <motion.div
                      key={ann._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="relative cyber-card p-6 space-y-3"
                    >
                      {/* Timeline Dot Indicator */}
                      <span className="absolute -left-[31px] md:-left-[39px] top-6 bg-cyberDeep border-2 border-neonPurple rounded-full p-1 w-4 h-4 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-neonMagenta rounded-full"></span>
                      </span>

                      {/* Header Card (Date + Priority) */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neonPurple/10 pb-2">
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-sans">
                          <Clock className="h-3.5 w-3.5 text-neonPurple" />
                          <span>{annDate}</span>
                        </div>

                        {/* Priority Badge */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-cyber font-bold tracking-wider uppercase border ${
                          ann.priority === 'High'
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : ann.priority === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                        }`}>
                          <AlertCircle className="h-3 w-3" />
                          {ann.priority} PRIORITY
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold font-cyber text-white tracking-wide">
                        {ann.title}
                      </h3>

                      {/* Content */}
                      <p className="text-slate-300 text-sm leading-relaxed font-sans whitespace-pre-line">
                        {ann.content}
                      </p>

                      {/* Expiration date disclaimer (if time-bound) */}
                      {ann.isTimeBound && ann.expiryDate && (
                        <div className="text-[11px] font-sans text-neonPurple italic pt-2">
                          * Announcement expires on {new Date(ann.expiryDate).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
