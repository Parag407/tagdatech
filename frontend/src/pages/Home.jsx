import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Trophy, BookOpen, AlertCircle, MessageSquare, Instagram, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    document.title = "Tagda Tech - Elite Developer Community";
    const fetchAnnouncements = async () => {
      try {
        const response = await api.get('/announcements');
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error loading announcements:', error);
      }
    };
    fetchAnnouncements();
  }, []);

  // Announcements Ticker rotation
  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const pillars = [
    {
      title: 'Hackathons',
      icon: <Code className="h-8 w-8 text-neonMagenta" />,
      desc: 'Form teams, build software solutions, and compete in standard 48-hour sprints.',
      link: '/events',
      cta: 'View Hackathons'
    },
    {
      title: 'E-Sports',
      icon: <Trophy className="h-8 w-8 text-emerald-400" />,
      desc: 'Participate in Valorant, BGMI, and Chess matches. Dominate the community boards.',
      link: '/events',
      cta: 'Explore Tourneys'
    },
    {
      title: 'Study Center',
      icon: <BookOpen className="h-8 w-8 text-neonPurple" />,
      desc: 'Free, highly structured developer guides, roadmap notes, and programming cheatsheets.',
      link: '/notes',
      cta: 'Download Notes'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between">
      
      {/* Background 3D-like Floating Spheres & Toruses & Graph Matrix */}
      
      {/* Graph Matrix HUD Layout */}
      <div className="absolute inset-0 pointer-events-none opacity-85 z-0">
        {/* Subtle white grid of dots */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1.5px,transparent_1.5px)] [background-size:32px_32px]"></div>
        
        {/* Large graph layout lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:96px_96px]"></div>
        
        {/* Additional decorative grid coordinate indicators */}
        <div className="absolute top-10 left-10 font-mono text-[10px] text-white/35 select-none tracking-widest hidden md:block">
          SYS_SEC_COORD // 47.92.01
        </div>
        <div className="absolute top-10 right-10 font-mono text-[10px] text-white/35 select-none tracking-widest hidden md:block">
          STATUS: IN_DEV // HACKATHON_V1
        </div>
      </div>

      {/* Top-Left Torus (Bigger) */}
      <div className="absolute -top-20 -left-20 w-80 h-80 md:w-[480px] md:h-[480px] rounded-full border-[32px] md:border-[60px] border-neonPurple/20 opacity-70 blur-[1px] pointer-events-none z-0">
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(199,125,255,0.3),0_0_50px_rgba(157,78,221,0.4)]"></div>
      </div>
      
      {/* Top-Right Glowing Sphere (Bigger) */}
      <div className="absolute top-16 right-5 w-36 h-36 md:w-56 md:h-56 rounded-full bg-[radial-gradient(circle_at_30%_30%,#C77DFF_0%,#9D4EDD_45%,#0B0116_100%)] shadow-[0_0_40px_rgba(157,78,221,0.45)] opacity-85 pointer-events-none z-0 animate-pulse-glow"></div>

      {/* Bottom-Left Glowing Sphere (Bigger) */}
      <div className="absolute bottom-1/4 left-2 w-28 h-28 md:w-44 md:h-44 rounded-full bg-[radial-gradient(circle_at_30%_30%,#C77DFF_0%,#9D4EDD_50%,#06010D_100%)] shadow-[0_0_35px_rgba(157,78,221,0.35)] opacity-80 pointer-events-none z-0"></div>

      {/* Bottom-Right Large 3D Torus (Bigger) */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 md:w-[620px] md:h-[620px] rounded-full border-[44px] md:border-[84px] border-neonPurple/15 opacity-70 blur-[0.5px] pointer-events-none z-0 transform rotate-12">
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_80px_rgba(199,125,255,0.45),0_0_70px_rgba(157,78,221,0.35)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 flex-grow">
        
        {/* Latest Announcement Ticker Banner */}
        {announcements.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-cyberDark/80 border border-neonPurple/30 rounded-xl px-4 py-3 backdrop-blur-md flex items-center justify-between gap-4 max-w-4xl mx-auto shadow-cyber-neon/20"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="flex-shrink-0 bg-neonPurple/20 p-1.5 rounded-lg border border-neonPurple/40">
                <AlertCircle className="h-4 w-4 text-neonMagenta" />
              </span>
              <div className="h-6 overflow-hidden relative w-full text-sm font-cyber font-medium text-slate-200">
                <motion.div
                  key={tickerIndex}
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -25, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="line-clamp-1"
                >
                  <span className="text-neonMagenta mr-2">[{announcements[tickerIndex].priority} UPDATE]</span>
                  {announcements[tickerIndex].title}: {announcements[tickerIndex].content}
                </motion.div>
              </div>
            </div>
            <Link 
              to="/announcements" 
              className="flex-shrink-0 text-xs font-cyber text-neonMagenta hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              All Updates <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>
        )}

        {/* Hero Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto space-y-6 py-12 flex flex-col items-center relative"
        >
          {/* Custom Logo Emblem */}
          <motion.div variants={itemVariants} className="relative z-10 select-none mb-4 md:mb-6">
            <img 
              src="/Tagda_Tech_Logo (1).png" 
              alt="Tagda Tech Logo" 
              className="w-48 h-48 md:w-64 md:h-64 mx-auto drop-shadow-[0_0_20px_rgba(157,78,221,0.65)] object-contain transition-transform duration-500 hover:scale-105"
            />
          </motion.div>

          {/* TAGDA TECH Heading */}
          <motion.div variants={itemVariants} className="space-y-1 z-10 mt-6 md:mt-8">
            <h1 className="text-4xl sm:text-6xl font-black tracking-[0.25em] font-cyber text-white drop-shadow-[0_0_15px_rgba(199,125,255,0.65)]">
              TAGDA TECH
            </h1>
          </motion.div>


          {/* A CHALLENGE OPEN FOR EVERYONE AND ANYONE */}
          <motion.p 
            variants={itemVariants}
            className="font-sans font-bold text-xs sm:text-sm text-slate-300 tracking-[0.12em] z-10 text-center uppercase"
          >
            A CHALLENGE OPEN FOR EVERYONE AND ANYONE
          </motion.p>

          {/* COMING SOON... */}
          <motion.h3 
            variants={itemVariants}
            className="font-cyber text-2xl sm:text-4xl font-extrabold text-white tracking-[0.2em] z-10 py-2 drop-shadow-[0_0_15px_rgba(199,125,255,0.85)] animate-pulse-glow"
          >
            COMING SOON...
          </motion.h3>

          {/* Social Channels CTA Grid */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center items-center gap-4 pt-4 z-20"
          >
            <a 
              href="https://chat.whatsapp.com/sample-tagdatech-invite" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 font-cyber px-5 py-2.5 rounded-lg border text-sm font-semibold tracking-wider transition-all duration-300 ease-in-out bg-transparent border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:scale-105"
            >
              <MessageSquare className="h-4.5 w-4.5" />
              JOIN WHATSAPP
            </a>

            <a 
              href="https://instagram.com/sample-tagdatech" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 font-cyber px-5 py-2.5 rounded-lg border text-sm font-semibold tracking-wider transition-all duration-300 ease-in-out bg-transparent border-pink-500/40 text-pink-400 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:text-white hover:border-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:scale-105"
            >
              <Instagram className="h-4.5 w-4.5" />
              FOLLOW INSTAGRAM
            </a>

            <a 
              href="https://linkedin.com/company/sample-tagdatech" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 font-cyber px-5 py-2.5 rounded-lg border text-sm font-semibold tracking-wider transition-all duration-300 ease-in-out bg-transparent border-sky-500/40 text-sky-400 hover:bg-sky-600 hover:text-white hover:border-sky-500 hover:shadow-[0_0_15px_rgba(14,165,233,0.5)] hover:scale-105"
            >
              <Linkedin className="h-4.5 w-4.5" />
              LINKEDIN
            </a>
          </motion.div>

        </motion.div>

        {/* Core Pillars Section */}
        <div className="mt-24 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-wide">WHAT WE FOCUS ON</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">Explore our three key pillars of operations and grow with the community.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="cyber-card p-8 flex flex-col justify-between h-full group"
              >
                <div className="space-y-4">
                  <div className="bg-cyberDark p-3 rounded-lg border border-neonPurple/20 inline-block group-hover:border-neonPurple/60 transition-colors duration-300">
                    {pillar.icon}
                  </div>
                  <h3 className="text-2xl font-cyber font-bold text-white group-hover:text-neonMagenta transition-colors duration-300">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-sans">
                    {pillar.desc}
                  </p>
                </div>
                
                <div className="pt-6 mt-6 border-t border-neonPurple/10">
                  <Link 
                    to={pillar.link} 
                    className="text-sm font-cyber font-semibold text-neonMagenta hover:text-white flex items-center gap-1.5 transition-colors group-hover:translate-x-1 duration-200"
                  >
                    {pillar.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
