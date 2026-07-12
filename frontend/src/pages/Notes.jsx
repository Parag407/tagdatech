import React, { useEffect, useState } from 'react';
import { Download, Search, Tag, RefreshCw, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [error, setError] = useState('');

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setError('Could not retrieve notes catalog. Check connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDownload = async (noteId, fileUrl) => {
    try {
      // Fire increment call to API
      await api.patch(`/notes/${noteId}/download`);
      
      // Update download count locally in state
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? { ...note, downloads: note.downloads + 1 } : note
        )
      );

      // Trigger file download
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Download dispatch error:', error);
      // Fallback: open link anyway
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Get unique subjects
  const subjects = ['All', ...new Set(notes.map((n) => n.subject))];

  // Filters logic
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          note.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="min-h-screen py-12 relative">
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-neonPurple/5 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Title */}
        <div className="border-b border-neonPurple/10 pb-6 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold font-cyber tracking-wider text-white">STUDY CENTER</h1>
          <p className="text-slate-400 text-sm">Free programming roadmaps, documentation guides, and educational handouts.</p>
        </div>

        {/* Search and Filters panel */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by topic, tag, or language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cyber-input pl-10"
            />
          </div>

          {/* Subject Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-lg font-cyber text-xs tracking-wider border transition-all duration-200 ${
                  selectedSubject === sub
                    ? 'bg-neonPurple text-white border-neonPurple shadow-cyber-neon/30'
                    : 'bg-cyberDark/50 text-slate-400 border-neonPurple/10 hover:text-white hover:border-neonPurple/40'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCw className="h-8 w-8 text-neonMagenta animate-spin" />
            <p className="text-slate-500 font-cyber text-sm tracking-widest">LOADING CATALOG...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-cyberDark/50 border border-red-500/20 rounded-xl max-w-lg mx-auto p-6 space-y-4">
            <p className="text-red-400 font-sans">{error}</p>
            <button 
              onClick={fetchNotes}
              className="cyber-btn-secondary py-2 px-4 mx-auto text-xs"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-lg font-cyber font-bold tracking-widest text-neonMagenta flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              AVAILABLE RESOURCES ({filteredNotes.length})
            </h2>

            {filteredNotes.length === 0 ? (
              <div className="border border-dashed border-neonPurple/20 bg-cyberDark/30 rounded-xl py-16 text-center text-slate-500 font-sans">
                No matching notes found. Try checking spelling or resetting subject filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredNotes.map((note) => (
                    <motion.div
                      key={note._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="cyber-card p-6 flex flex-col justify-between h-full"
                    >
                      <div className="space-y-4">
                        {/* Subject Header */}
                        <div className="text-xs font-cyber text-neonMagenta uppercase tracking-widest border-b border-neonPurple/15 pb-2">
                          {note.subject}
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-lg font-bold font-cyber text-white tracking-wide line-clamp-2">
                          {note.title}
                        </h3>

                        {/* Tags */}
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {note.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-cyberDark border border-neonPurple/10 text-xs text-slate-400 font-sans"
                              >
                                <Tag className="h-3 w-3 text-neonPurple" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Downloads and Download Button */}
                      <div className="mt-8 pt-4 border-t border-neonPurple/10 flex items-center justify-between gap-4">
                        <span className="text-xs font-cyber text-slate-500">
                          DOWNLOADS: <span className="text-neonMagenta font-bold">{note.downloads}</span>
                        </span>
                        
                        <button
                          onClick={() => handleDownload(note._id, note.fileUrl)}
                          className="cyber-btn-secondary py-1.5 px-4 text-xs font-cyber border-neonPurple/40 hover:border-neonPurple flex items-center gap-1.5 text-neonMagenta hover:bg-neonPurple/10"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>GET FILE</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
