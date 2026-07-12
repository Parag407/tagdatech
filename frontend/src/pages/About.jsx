import React from 'react';
import { Target, Users, BookOpen, Terminal, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  React.useEffect(() => {
    document.title = "About Us - Tagda Tech";
  }, []);

  const values = [
    {
      title: 'Action-First Philosophy',
      icon: <Terminal className="h-6 w-6 text-neonMagenta" />,
      desc: 'We value shipping over planning. As our slogan goes: "Average is the enemy. Ship it or step aside." We motivate developers to build real applications.'
    },
    {
      title: 'Competitive Spirit',
      icon: <Target className="h-6 w-6 text-emerald-400" />,
      desc: 'Growth occurs through peer competition. We run weekly coding problems, esports scrims, and hackathons to push members out of their comfort zones.'
    },
    {
      title: 'Knowledge Sharing',
      icon: <BookOpen className="h-6 w-6 text-neonPurple" />,
      desc: 'Access to programming handouts shouldn’t be gated. We curate and share notes on frontend engineering, database architectures, and algorithms for free.'
    }
  ];

  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-neonPurple/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <span className="font-cyber text-xs tracking-[0.25em] font-extrabold text-neonMagenta bg-neonPurple/10 px-4 py-1.5 rounded-full border border-neonPurple/20 uppercase">
            WHO WE ARE
          </span>
          <h1 className="text-4xl font-extrabold font-cyber tracking-wider text-white">THE TAGDA TECH STORY</h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">An elite cluster of software engineers, creators, hackers, and competitive gamers.</p>
        </div>

        {/* Origin Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="cyber-card p-8 md:p-10 space-y-6 relative overflow-hidden"
        >
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-neonPurple/10 rounded-full blur-[50px] pointer-events-none"></div>

          <h2 className="text-2xl font-bold font-cyber text-white flex items-center gap-2">
            <Sparkles className="h-5.5 w-5.5 text-neonMagenta animate-pulse" />
            OUR ECOSYSTEM
          </h2>
          <div className="space-y-4 text-slate-300 font-sans leading-relaxed text-sm">
            <p>
              Tagda Tech began as a close-knit group of developers tired of conventional tutoring systems. We realized coding is best learned not by memorizing documentation, but by building and breaking things in high-stakes environments.
            </p>
            <p>
              We grew from a local WhatsApp group into a dynamic collective of engineers, designers, hackers, and esports enthusiasts. We bridge the gap between structural education and industry demands.
            </p>
          </div>
        </motion.div>

        {/* Core Values Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-widest font-cyber text-center text-neonMagenta">WHAT DRIVES US</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="cyber-card p-6 space-y-3"
              >
                <div className="bg-cyberDark p-2.5 rounded-lg border border-neonPurple/20 inline-block">
                  {v.icon}
                </div>
                <h3 className="font-cyber font-bold text-white text-base">{v.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-sans">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Community Management/Leadership Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="cyber-card p-6 flex flex-col sm:flex-row items-center gap-6 border-l-4 border-l-neonPurple"
        >
          <div className="bg-neonPurple/15 p-4 rounded-xl border border-neonPurple/30 flex-shrink-0">
            <Users className="h-8 w-8 text-neonMagenta" />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-cyber font-bold text-white text-lg">Community Board & Management</h3>
            <p className="text-slate-400 text-sm font-sans leading-relaxed">
              Our servers, tournaments, and content uploads are moderated by dedicated volunteers and core community leads. We ensure a safe, collaborative space for aspiring builders.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default About;
