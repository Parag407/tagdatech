import React from 'react';
import { Calendar, ExternalLink, Trophy, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import TrackedButton from './TrackedButton';

const EventCard = ({ event, onJoined }) => {
  const { _id, title, description, type, date, registrationLink, imageUrl, interactions } = event;

  const eventDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleRegister = () => {
    // Open registration link in a new tab
    window.open(registrationLink, '_blank', 'noopener,noreferrer');
    if (onJoined) {
      onJoined(_id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="cyber-card flex flex-col h-full"
    >
      {/* Event Header Image */}
      <div className="relative h-48 overflow-hidden bg-cyberDark">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-cyber font-bold tracking-wider uppercase border ${
            type === 'Hackathon'
              ? 'bg-neonPurple/20 text-neonMagenta border-neonPurple/50'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            {type === 'Hackathon' ? <Code className="h-3.5 w-3.5" /> : <Trophy className="h-3.5 w-3.5" />}
            {type}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div className="space-y-3">
          {/* Date */}
          <div className="flex items-center gap-2 text-slate-400 text-sm font-sans">
            <Calendar className="h-4 w-4 text-neonPurple" />
            <span>{eventDate}</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold tracking-wide text-white font-cyber hover:text-neonMagenta transition-colors line-clamp-1">
            {title}
          </h3>

          {/* Description */}
          <p className="text-slate-400 text-sm leading-relaxed font-sans line-clamp-3">
            {description}
          </p>
        </div>

        {/* Footer info & action */}
        <div className="mt-6 pt-4 border-t border-neonPurple/10 flex items-center justify-between gap-4">
          <div className="text-xs font-cyber text-slate-500">
            INTERACTIONS: <span className="text-neonMagenta font-bold">{interactions}</span>
          </div>

          <TrackedButton
            trackingEndpoint={`/events/${_id}/join`}
            onClick={handleRegister}
            className="cyber-btn-secondary py-1.5 px-4 text-xs font-cyber flex items-center gap-1 border-emerald-500/20 hover:border-emerald-500/70 hover:shadow-none hover:bg-emerald-500/10 text-emerald-400"
          >
            <span>REGISTER</span>
            <ExternalLink className="h-3 w-3" />
          </TrackedButton>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
