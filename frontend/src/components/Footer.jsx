import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Instagram, Linkedin, MessageSquare, Terminal } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cyberDark border-t border-neonPurple/20 py-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-neonPurple/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-neonPurple/15 p-1 rounded-md border border-neonPurple/30">
                <Terminal className="h-4 w-4 text-neonMagenta" />
              </div>
              <span className="font-cyber font-black tracking-wider text-lg text-white">
                TAGDA TECH
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm font-sans leading-relaxed">
              An elite tech community powering hackathons, e-sports, and developer resources. Driven by excellence.
            </p>
           
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h3 className="font-cyber text-sm tracking-widest text-slate-300 font-bold uppercase">Navigator</h3>
            <ul className="space-y-2 text-sm text-slate-400 font-sans">
              <li>
                <Link to="/" className="hover:text-neonMagenta transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-neonMagenta transition-colors">Events</Link>
              </li>
              <li>
                <Link to="/notes" className="hover:text-neonMagenta transition-colors">Study Center</Link>
              </li>
              <li>
                <Link to="/announcements" className="hover:text-neonMagenta transition-colors">Announcements</Link>
              </li>
            </ul>
          </div>

          {/* Socials Connection */}
          <div className="space-y-3">
            <h3 className="font-cyber text-sm tracking-widest text-slate-300 font-bold uppercase">Connect</h3>
            <div className="flex items-center gap-4 text-slate-400">
              <a 
                href="https://chat.whatsapp.com/sample-tagdatech-invite" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-neonMagenta transition-colors p-2 bg-cyberDeep rounded-lg border border-neonPurple/10 hover:border-neonPurple/50"
                aria-label="WhatsApp Community"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
              <a 
                href="https://instagram.com/sample-tagdatech" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-neonMagenta transition-colors p-2 bg-cyberDeep rounded-lg border border-neonPurple/10 hover:border-neonPurple/50"
                aria-label="Instagram Page"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://linkedin.com/company/sample-tagdatech" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-neonMagenta transition-colors p-2 bg-cyberDeep rounded-lg border border-neonPurple/10 hover:border-neonPurple/50"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
            <div className="text-xs text-slate-500 font-sans pt-2">
              Website host: <span className="text-neonMagenta">tagdatech.pages.dev</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neonPurple/10 my-6 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-sans">
          <p>© {currentYear} Tagda Tech Community. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link to="/admin" className="hover:text-neonMagenta transition-colors flex items-center gap-1 font-cyber">
              <Globe className="h-3 w-3" /> ADMIN PORTAL
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
