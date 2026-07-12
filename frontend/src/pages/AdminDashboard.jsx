import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  BarChart3, Calendar, BookOpen, Megaphone, Mail, LogOut, 
  Trash2, Plus, X, Lock, Eye, AlertCircle, RefreshCw, Layers 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const AdminDashboard = () => {
  const { user, isAuthenticated, loading: authLoading, login, logout } = useAdmin();

  // Login form state
  const [loginCreds, setLoginCreds] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Tab control: 'metrics', 'events', 'notes', 'announcements', 'messages'
  const [activeTab, setActiveTab] = useState('metrics');

  // Resource lists state
  const [events, setEvents] = useState([]);
  const [notes, setNotes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [loadError, setLoadError] = useState('');

  // Modals state
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // Creation forms states
  const [eventForm, setEventForm] = useState({
    title: '', description: '', type: 'Hackathon', date: '', registrationLink: '', imageUrl: ''
  });
  const [noteForm, setNoteForm] = useState({
    title: '', subject: '', fileUrl: '', tagsString: ''
  });
  const [announcementForm, setAnnouncementForm] = useState({
    title: '', content: '', priority: 'Medium', isTimeBound: false, expiryDate: ''
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load all dashboard resource tables
  const loadDashboardData = async () => {
    if (!isAuthenticated) return;
    setLoadingResources(true);
    setLoadError('');
    try {
      const [eventsRes, notesRes, annRes, msgRes] = await Promise.all([
        api.get('/events'),
        api.get('/notes'),
        api.get('/announcements/admin'), // Fetch all, including expired
        api.get('/messages')
      ]);

      setEvents(eventsRes.data);
      setNotes(notesRes.data);
      setAnnouncements(annRes.data);
      setMessages(msgRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setLoadError('Failed to retrieve control deck files. Make sure MongoDB database is online.');
    } finally {
      setLoadingResources(false);
    }
  };

  useEffect(() => {
    document.title = "Admin Control Panel - Tagda Tech";
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  // Auth Submit Handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);

    if (!loginCreds.username || !loginCreds.password) {
      setLoginError('Both admin credentials must be filled.');
      setLoggingIn(false);
      return;
    }

    const res = await login(loginCreds.username, loginCreds.password);
    if (!res.success) {
      setLoginError(res.error || 'Access denied.');
    }
    setLoggingIn(false);
  };

  // Creation Submit Handlers
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    const { title, description, type, date, registrationLink } = eventForm;
    if (!title || !description || !type || !date || !registrationLink) {
      setFormError('All fields except Image URL are required.');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/events', eventForm);
      setFormSuccess('Event successfully published.');
      setEventForm({ title: '', description: '', type: 'Hackathon', date: '', registrationLink: '', imageUrl: '' });
      loadDashboardData();
      setTimeout(() => setShowEventModal(false), 1500);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to create event.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    const { title, subject, fileUrl, tagsString } = noteForm;
    if (!title || !subject || !fileUrl) {
      setFormError('Title, subject, and file URL are required.');
      setSubmitting(false);
      return;
    }

    const tags = tagsString ? tagsString.split(',').map(t => t.trim()).filter(Boolean) : [];

    try {
      await api.post('/notes', { title, subject, fileUrl, tags });
      setFormSuccess('Note entry successfully uploaded.');
      setNoteForm({ title: '', subject: '', fileUrl: '', tagsString: '' });
      loadDashboardData();
      setTimeout(() => setShowNoteModal(false), 1500);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to publish note.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    const { title, content, priority, isTimeBound, expiryDate } = announcementForm;
    if (!title || !content) {
      setFormError('Title and content are required.');
      setSubmitting(false);
      return;
    }

    if (isTimeBound && !expiryDate) {
      setFormError('Expiry Date is required for time-bound announcements.');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/announcements', {
        title, content, priority, isTimeBound, expiryDate: isTimeBound ? expiryDate : undefined
      });
      setFormSuccess('Announcement successfully broadcasted.');
      setAnnouncementForm({ title: '', content: '', priority: 'Medium', isTimeBound: false, expiryDate: '' });
      loadDashboardData();
      setTimeout(() => setShowAnnouncementModal(false), 1500);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to create announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  // Deletion/Dismiss handlers
  const handleDeleteResource = async (endpoint, id) => {
    if (!window.confirm('Are you sure you want to delete this resource? This action is permanent.')) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      loadDashboardData();
    } catch (error) {
      alert('Failed to delete item: ' + (error.response?.data?.error || error.message));
    }
  };

  // Compute stats metrics
  const totalEventJoins = events.reduce((sum, item) => sum + (item.interactions || 0), 0);
  const totalNoteDownloads = notes.reduce((sum, item) => sum + (item.downloads || 0), 0);
  const totalMessagesCount = messages.length;
  const activeAnnouncementsCount = announcements.filter(
    a => !a.isTimeBound || new Date(a.expiryDate) > new Date()
  ).length;

  // Render Login overlay
  if (authLoading) {
    return (
      <div className="min-h-screen bg-cyberDeep flex items-center justify-center flex-col gap-4">
        <RefreshCw className="h-8 w-8 text-neonMagenta animate-spin" />
        <span className="font-cyber text-sm tracking-widest text-slate-500">AUTHORIZING ADMIN SYSTEM...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cyberDeep flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-neonPurple/15 rounded-full blur-[80px] pointer-events-none animate-pulse-glow"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full space-y-8 bg-cyberDark/80 border border-neonPurple/30 p-8 rounded-2xl backdrop-blur-md relative"
        >
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neonMagenta"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neonMagenta"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neonMagenta"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neonMagenta"></div>

          <div className="text-center space-y-3">
            <div className="bg-neonPurple/20 p-3 rounded-2xl border border-neonPurple/40 inline-flex items-center justify-center">
              <Lock className="h-8 w-8 text-neonMagenta animate-pulse" />
            </div>
            <h2 className="text-2xl font-cyber font-bold tracking-widest text-white">DECK SECURITY</h2>
            <p className="text-slate-400 text-xs font-sans">Access restricted to accounts matching role admin.</p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-xs flex items-center gap-2 font-sans">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="username" className="block text-xs font-cyber text-slate-300 font-semibold uppercase">Admin Username</label>
              <input
                type="text"
                id="username"
                required
                value={loginCreds.username}
                onChange={(e) => setLoginCreds({ ...loginCreds, username: e.target.value })}
                placeholder="Username"
                className="cyber-input"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-cyber text-slate-300 font-semibold uppercase">Passkey</label>
              <input
                type="password"
                id="password"
                required
                value={loginCreds.password}
                onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
                placeholder="••••••••"
                className="cyber-input"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="cyber-btn-primary w-full mt-4"
            >
              {loggingIn ? 'DECRYPTING...' : 'LOGIN TO CONSOLE'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Dashboard Control Deck Layout
  return (
    <div className="min-h-screen py-10 bg-cyberDeep text-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neonPurple/20 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-cyber font-black tracking-widest text-white">CONTROL DECK</h1>
            <p className="text-xs text-slate-400 font-sans">Authenticated as <span className="text-neonMagenta font-bold">@{user.username}</span> ({user.role})</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadDashboardData}
              className="cyber-btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 border-neonPurple/20 text-slate-300 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reload Data</span>
            </button>
            
            <button
              onClick={logout}
              className="cyber-btn-primary py-1.5 px-3 text-xs bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700 flex items-center gap-1"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Dynamic Metric Scoreboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="cyber-card p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-cyber tracking-wider font-bold">EVENT JOINS</span>
              <Calendar className="h-5 w-5 text-neonMagenta" />
            </div>
            <p className="text-2xl sm:text-3xl font-cyber font-black text-white">{totalEventJoins}</p>
            <p className="text-[10px] text-slate-500 font-sans">Total click-join interaction counts</p>
          </div>

          <div className="cyber-card p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-cyber tracking-wider font-bold">NOTE DOWNLOADS</span>
              <BookOpen className="h-5 w-5 text-neonPurple" />
            </div>
            <p className="text-2xl sm:text-3xl font-cyber font-black text-white">{totalNoteDownloads}</p>
            <p className="text-[10px] text-slate-500 font-sans">Programming handouts downloaded</p>
          </div>

          <div className="cyber-card p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-cyber tracking-wider font-bold">INQUIRIES</span>
              <Mail className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-cyber font-black text-white">{totalMessagesCount}</p>
            <p className="text-[10px] text-slate-500 font-sans">Total contact message receipts</p>
          </div>

          <div className="cyber-card p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-cyber tracking-wider font-bold">ANNOUNCEMENTS</span>
              <Megaphone className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-cyber font-black text-white">{activeAnnouncementsCount}</p>
            <p className="text-[10px] text-slate-500 font-sans">Active broadcasts on bulletin board</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neonPurple/10 pb-4">
          {[
            { id: 'metrics', label: 'Metrics', icon: <BarChart3 className="h-4 w-4" /> },
            { id: 'events', label: 'Events', icon: <Calendar className="h-4 w-4" /> },
            { id: 'notes', label: 'Notes', icon: <BookOpen className="h-4 w-4" /> },
            { id: 'announcements', label: 'Updates', icon: <Megaphone className="h-4 w-4" /> },
            { id: 'messages', label: `Inquiries (${totalMessagesCount})`, icon: <Mail className="h-4 w-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-cyber text-xs tracking-wider flex items-center gap-1.5 border transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-neonPurple text-white border-neonPurple shadow-cyber-neon/30'
                  : 'bg-cyberDark/50 text-slate-400 border-neonPurple/10 hover:text-white hover:border-neonPurple/40'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard tables content area */}
        {loadingResources ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCw className="h-8 w-8 text-neonMagenta animate-spin" />
            <p className="text-slate-500 font-cyber text-sm tracking-widest">PULLING CONSOLE DATA...</p>
          </div>
        ) : loadError ? (
          <div className="text-center py-12 bg-red-950/20 border border-red-500/30 rounded-xl p-6 text-red-400 text-sm font-sans max-w-lg mx-auto">
            {loadError}
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 1. METRICS OVERVIEW */}
            {activeTab === 'metrics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Event Joins Leaderboard */}
                <div className="cyber-card p-6 space-y-4">
                  <h3 className="text-sm font-cyber font-bold tracking-wider text-neonMagenta uppercase flex items-center gap-2">
                    <Layers className="h-4.5 w-4.5" /> Event Registration Metrics
                  </h3>
                  {events.length === 0 ? (
                    <p className="text-xs text-slate-500 font-sans">No events on record.</p>
                  ) : (
                    <div className="space-y-3 pt-2">
                      {events.map((evt) => (
                        <div key={evt._id} className="space-y-1 font-sans text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 font-medium truncate max-w-[200px]">{evt.title}</span>
                            <span className="text-neonMagenta font-bold">{evt.interactions} clicks</span>
                          </div>
                          <div className="w-full bg-cyberDeep h-2 rounded-full overflow-hidden border border-neonPurple/10">
                            <div 
                              className="bg-neonPurple h-full rounded-full" 
                              style={{ width: `${Math.min(100, (evt.interactions / (totalEventJoins || 1)) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes Downloads Leaderboard */}
                <div className="cyber-card p-6 space-y-4">
                  <h3 className="text-sm font-cyber font-bold tracking-wider text-neonMagenta uppercase flex items-center gap-2">
                    <BookOpen className="h-4.5 w-4.5" /> Handout Download Metrics
                  </h3>
                  {notes.length === 0 ? (
                    <p className="text-xs text-slate-500 font-sans">No notes uploaded.</p>
                  ) : (
                    <div className="space-y-3 pt-2">
                      {notes.map((n) => (
                        <div key={n._id} className="space-y-1 font-sans text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 font-medium truncate max-w-[200px]">{n.title}</span>
                            <span className="text-neonPurple font-bold">{n.downloads} downloads</span>
                          </div>
                          <div className="w-full bg-cyberDeep h-2 rounded-full overflow-hidden border border-neonPurple/10">
                            <div 
                              className="bg-neonMagenta h-full rounded-full" 
                              style={{ width: `${Math.min(100, (n.downloads / (totalNoteDownloads || 1)) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 2. EVENTS CRUD */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-cyber font-bold tracking-wider text-white text-base">EVENTS LIST</h3>
                  <button
                    onClick={() => { setFormError(''); setFormSuccess(''); setShowEventModal(true); }}
                    className="cyber-btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Event</span>
                  </button>
                </div>

                {events.length === 0 ? (
                  <div className="border border-dashed border-neonPurple/20 bg-cyberDark/30 rounded-xl py-12 text-center text-slate-500 font-sans text-sm">
                    No events currently configured.
                  </div>
                ) : (
                  <div className="cyber-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                          <tr className="bg-cyberDark/80 border-b border-neonPurple/20 font-cyber text-slate-400 uppercase tracking-wider">
                            <th className="p-4">Title</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Interactions</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.map((evt) => (
                            <tr key={evt._id} className="border-b border-neonPurple/10 hover:bg-neonPurple/5">
                              <td className="p-4 font-semibold text-white font-cyber">{evt.title}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-cyber uppercase tracking-wider font-bold border ${
                                  evt.type === 'Hackathon' ? 'bg-neonPurple/20 text-neonMagenta border-neonPurple/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                }`}>
                                  {evt.type}
                                </span>
                              </td>
                              <td className="p-4 text-slate-300">{new Date(evt.date).toLocaleDateString()}</td>
                              <td className="p-4 font-mono font-bold text-neonMagenta">{evt.interactions}</td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => handleDeleteResource('/events', evt._id)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5 rounded transition-colors"
                                  aria-label="Delete Event"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. NOTES CRUD */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-cyber font-bold tracking-wider text-white text-base">NOTES HANDOUTS</h3>
                  <button
                    onClick={() => { setFormError(''); setFormSuccess(''); setShowNoteModal(true); }}
                    className="cyber-btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Upload Handout</span>
                  </button>
                </div>

                {notes.length === 0 ? (
                  <div className="border border-dashed border-neonPurple/20 bg-cyberDark/30 rounded-xl py-12 text-center text-slate-500 font-sans text-sm">
                    No notes currently cataloged.
                  </div>
                ) : (
                  <div className="cyber-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                          <tr className="bg-cyberDark/80 border-b border-neonPurple/20 font-cyber text-slate-400 uppercase tracking-wider">
                            <th className="p-4">Title</th>
                            <th className="p-4">Subject</th>
                            <th className="p-4">Downloads</th>
                            <th className="p-4">Tags</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {notes.map((n) => (
                            <tr key={n._id} className="border-b border-neonPurple/10 hover:bg-neonPurple/5">
                              <td className="p-4 font-semibold text-white font-cyber">{n.title}</td>
                              <td className="p-4 text-neonMagenta font-cyber">{n.subject}</td>
                              <td className="p-4 font-mono font-bold text-neonPurple">{n.downloads}</td>
                              <td className="p-4">
                                <div className="flex flex-wrap gap-1">
                                  {n.tags.map(t => (
                                    <span key={t} className="bg-cyberDeep border border-neonPurple/10 px-2 py-0.5 rounded text-[10px] text-slate-400">{t}</span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => handleDeleteResource('/notes', n._id)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5 rounded transition-colors"
                                  aria-label="Delete Note"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. ANNOUNCEMENTS CRUD */}
            {activeTab === 'announcements' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-cyber font-bold tracking-wider text-white text-base">BULLETIN BROADCASTS</h3>
                  <button
                    onClick={() => { setFormError(''); setFormSuccess(''); setShowAnnouncementModal(true); }}
                    className="cyber-btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Post Update</span>
                  </button>
                </div>

                {announcements.length === 0 ? (
                  <div className="border border-dashed border-neonPurple/20 bg-cyberDark/30 rounded-xl py-12 text-center text-slate-500 font-sans text-sm">
                    No announcements posted.
                  </div>
                ) : (
                  <div className="cyber-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                          <tr className="bg-cyberDark/80 border-b border-neonPurple/20 font-cyber text-slate-400 uppercase tracking-wider">
                            <th className="p-4">Title</th>
                            <th className="p-4">Priority</th>
                            <th className="p-4">Timing</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {announcements.map((ann) => {
                            const isExpired = ann.isTimeBound && new Date(ann.expiryDate) < new Date();
                            return (
                              <tr key={ann._id} className="border-b border-neonPurple/10 hover:bg-neonPurple/5">
                                <td className="p-4 font-semibold text-white font-cyber max-w-sm truncate">{ann.title}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-cyber uppercase tracking-wider font-bold border ${
                                    ann.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ann.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                  }`}>
                                    {ann.priority}
                                  </span>
                                </td>
                                <td className="p-4 text-slate-300">
                                  {ann.isTimeBound ? `Expires ${new Date(ann.expiryDate).toLocaleDateString()}` : 'Permanent'}
                                </td>
                                <td className="p-4">
                                  <span className={`font-semibold ${isExpired ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {isExpired ? 'Expired' : 'Active'}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => handleDeleteResource('/announcements', ann._id)}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5 rounded transition-colors"
                                    aria-label="Delete Announcement"
                                  >
                                    <Trash2 className="h-4.5 w-4.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. MESSAGES INBOX */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                <h3 className="font-cyber font-bold tracking-wider text-white text-base">USER SUBMISSIONS INBOX</h3>

                {messages.length === 0 ? (
                  <div className="border border-dashed border-neonPurple/20 bg-cyberDark/30 rounded-xl py-12 text-center text-slate-500 font-sans text-sm">
                    Inquiries inbox is empty. No messages found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg._id} className="cyber-card p-6 space-y-4 relative">
                        {/* Title line */}
                        <div className="flex items-center justify-between border-b border-neonPurple/10 pb-3">
                          <div className="space-y-1">
                            <span className="font-cyber font-bold text-white text-sm uppercase">{msg.subject}</span>
                            <div className="text-xs text-slate-400 font-sans">
                              From: <span className="text-neonMagenta font-medium">{msg.name}</span> (<a href={`mailto:${msg.email}`} className="text-neonPurple hover:underline">{msg.email}</a>)
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-500 font-sans">{new Date(msg.createdAt).toLocaleString()}</span>
                            <button
                              onClick={() => handleDeleteResource('/messages', msg._id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5 rounded transition-colors"
                              aria-label="Delete/Dismiss inquiry"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Content text */}
                        <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>

      {/* MODALS OVERLAYS */}
      {/* 1. Event Creator Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyberDeep/80 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-cyberDark border border-neonPurple/40 p-6 rounded-2xl w-full max-w-lg relative space-y-4"
          >
            <div className="flex justify-between items-center border-b border-neonPurple/15 pb-2">
              <h4 className="font-cyber font-bold text-white tracking-widest text-sm">CREATE NEW EVENT</h4>
              <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            {formError && <div className="text-red-400 text-xs font-sans bg-red-500/10 border border-red-500/20 p-2.5 rounded">{formError}</div>}
            {formSuccess && <div className="text-emerald-400 text-xs font-sans bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded">{formSuccess}</div>}

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-slate-300 font-cyber font-bold text-[10px] uppercase">Title</label>
                <input type="text" required placeholder="Event Title" className="cyber-input py-2" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-cyber font-bold text-[10px] uppercase">Description</label>
                <textarea required rows="2" placeholder="Describe the event structure and guidelines..." className="cyber-input py-2" value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})}></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-cyber font-bold text-[10px] uppercase">Category Type</label>
                  <select className="cyber-input py-2" value={eventForm.type} onChange={e => setEventForm({...eventForm, type: e.target.value})}>
                    <option value="Hackathon">Hackathon</option>
                    <option value="ESports">ESports</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-cyber font-bold text-[10px] uppercase">Event Date</label>
                  <input type="date" required className="cyber-input py-2" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-cyber font-bold text-[10px] uppercase">Registration URL</label>
                <input type="url" required placeholder="https://..." className="cyber-input py-2" value={eventForm.registrationLink} onChange={e => setEventForm({...eventForm, registrationLink: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-cyber font-bold text-[10px] uppercase">Poster Image URL</label>
                <input type="url" placeholder="https://..." className="cyber-input py-2" value={eventForm.imageUrl} onChange={e => setEventForm({...eventForm, imageUrl: e.target.value})} />
              </div>

              <button type="submit" disabled={submitting} className="cyber-btn-primary w-full py-2">{submitting ? 'SHIPPING...' : 'PUBLISH EVENT'}</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 2. Note Upload Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyberDeep/80 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-cyberDark border border-neonPurple/40 p-6 rounded-2xl w-full max-w-lg relative space-y-4"
          >
            <div className="flex justify-between items-center border-b border-neonPurple/15 pb-2">
              <h4 className="font-cyber font-bold text-white tracking-widest text-sm">CATALOG NEW NOTE</h4>
              <button onClick={() => setShowNoteModal(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            {formError && <div className="text-red-400 text-xs font-sans bg-red-500/10 border border-red-500/20 p-2.5 rounded">{formError}</div>}
            {formSuccess && <div className="text-emerald-400 text-xs font-sans bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded">{formSuccess}</div>}

            <form onSubmit={handleCreateNote} className="space-y-3 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-slate-300 font-cyber font-bold text-[10px] uppercase">Note Title</label>
                <input type="text" required placeholder="e.g. Intro to Docker Containers" className="cyber-input py-2" value={noteForm.title} onChange={e => setNoteForm({...noteForm, title: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-cyber font-bold text-[10px] uppercase">Subject Course</label>
                  <input type="text" required placeholder="e.g. Cloud Computing" className="cyber-input py-2" value={noteForm.subject} onChange={e => setNoteForm({...noteForm, subject: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-cyber font-bold text-[10px] uppercase">Tags (comma-separated)</label>
                  <input type="text" placeholder="e.g. Docker, Devops, Cloud" className="cyber-input py-2" value={noteForm.tagsString} onChange={e => setNoteForm({...noteForm, tagsString: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-cyber font-bold text-[10px] uppercase">Document File URL</label>
                <input type="url" required placeholder="https://..." className="cyber-input py-2" value={noteForm.fileUrl} onChange={e => setNoteForm({...noteForm, fileUrl: e.target.value})} />
              </div>

              <button type="submit" disabled={submitting} className="cyber-btn-primary w-full py-2">{submitting ? 'SHIPPING...' : 'SAVE NOTE'}</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 3. Announcement Broadcaster Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyberDeep/80 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-cyberDark border border-neonPurple/40 p-6 rounded-2xl w-full max-w-lg relative space-y-4"
          >
            <div className="flex justify-between items-center border-b border-neonPurple/15 pb-2">
              <h4 className="font-cyber font-bold text-white tracking-widest text-sm">BROADCAST UPDATE</h4>
              <button onClick={() => setShowAnnouncementModal(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            {formError && <div className="text-red-400 text-xs font-sans bg-red-500/10 border border-red-500/20 p-2.5 rounded">{formError}</div>}
            {formSuccess && <div className="text-emerald-400 text-xs font-sans bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded">{formSuccess}</div>}

            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-slate-300 font-cyber font-bold text-[10px] uppercase">Title</label>
                <input type="text" required placeholder="Broadcast Title" className="cyber-input py-2" value={announcementForm.title} onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-cyber font-bold text-[10px] uppercase">Content Body</label>
                <textarea required rows="3" placeholder="Enter broadcast details..." className="cyber-input py-2" value={announcementForm.content} onChange={e => setAnnouncementForm({...announcementForm, content: e.target.value})}></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-cyber font-bold text-[10px] uppercase">Broadcast Priority</label>
                  <select className="cyber-input py-2" value={announcementForm.priority} onChange={e => setAnnouncementForm({...announcementForm, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2 pt-5">
                  <input 
                    type="checkbox" 
                    id="isTimeBound" 
                    className="h-4 w-4 bg-cyberDeep rounded border-neonPurple/30 text-neonPurple focus:ring-neonPurple cursor-pointer" 
                    checked={announcementForm.isTimeBound} 
                    onChange={e => setAnnouncementForm({...announcementForm, isTimeBound: e.target.checked})} 
                  />
                  <label htmlFor="isTimeBound" className="text-slate-300 font-cyber font-bold text-[10px] uppercase cursor-pointer select-none">Time Bound?</label>
                </div>
              </div>

              {announcementForm.isTimeBound && (
                <div className="space-y-1">
                  <label className="text-slate-300 font-cyber font-bold text-[10px] uppercase">Expiry Date</label>
                  <input type="date" required className="cyber-input py-2" value={announcementForm.expiryDate} onChange={e => setAnnouncementForm({...announcementForm, expiryDate: e.target.value})} />
                </div>
              )}

              <button type="submit" disabled={submitting} className="cyber-btn-primary w-full py-2">{submitting ? 'SHIPPING...' : 'POST UPDATE'}</button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
