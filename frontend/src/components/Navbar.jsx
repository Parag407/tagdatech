import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, MessageSquare, Terminal } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Notes', path: '/notes' },
    { name: 'Updates', path: '/announcements' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-cyberDark/40 border-b border-neonPurple/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
              <div className="bg-cyberDark/60 p-0.5 rounded-lg border border-neonPurple/40 group-hover:border-neonMagenta transition-all duration-300">
                <img src="/Tagda_Tech_Logo (1).png" alt="Tagda Tech Logo" className="h-8 w-8 object-contain" />
              </div>
              <span className="font-cyber font-black tracking-wider text-xl bg-gradient-to-r from-white via-neonMagenta to-neonPurple bg-clip-text text-transparent group-hover:scale-[1.02] transition-all duration-300">
                TAGDA TECH
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md font-cyber text-sm tracking-wider font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-neonMagenta bg-neonPurple/10 border-b-2 border-neonMagenta'
                      : 'text-slate-300 hover:text-white hover:bg-neonPurple/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Call to Action Button */}
          <div className="hidden md:block">
            <a
              href="https://chat.whatsapp.com/sample-tagdatech-invite"
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-btn-primary py-2 px-4 text-xs font-semibold"
            >
              <MessageSquare className="h-4 w-4" />
              JOIN WHATSAPP
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-slate-300 hover:text-white p-2 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-cyberDeep/95 border-b border-neonPurple/20 backdrop-blur-lg">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block px-3 py-3 rounded-md font-cyber text-base tracking-wider font-semibold ${
                    isActive
                      ? 'text-neonMagenta bg-neonPurple/15 border-l-4 border-neonMagenta'
                      : 'text-slate-300 hover:text-white hover:bg-neonPurple/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-4 px-3">
              <a
                href="https://chat.whatsapp.com/sample-tagdatech-invite"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="cyber-btn-primary w-full py-2.5"
              >
                <MessageSquare className="h-4 w-4" />
                JOIN WHATSAPP
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
