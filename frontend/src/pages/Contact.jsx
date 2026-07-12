import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, MessageSquare, Instagram, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const Contact = () => {
  React.useEffect(() => {
    document.title = "Contact Us & Feedback - Tagda Tech";
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const { name, email, subject, message } = formData;

    // Client-side validations
    if (!name || !email || !message) {
      setError('Please fill in all required fields (Name, Email, Message)');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/messages', {
        name,
        email,
        subject,
        message,
      });

      if (response.data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError('Failed to send the message. Please try again.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setError(err.response?.data?.error || 'Server error. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const socials = [
    {
      name: 'WhatsApp Community',
      icon: <MessageSquare className="h-5 w-5 text-emerald-400" />,
      desc: 'Connect with developers and gamers in real-time.',
      link: 'https://chat.whatsapp.com/sample-tagdatech-invite'
    },
    {
      name: 'Instagram Profile',
      icon: <Instagram className="h-5 w-5 text-pink-400" />,
      desc: 'Check flyers, results, and weekly updates.',
      link: 'https://instagram.com/sample-tagdatech'
    },
    {
      name: 'LinkedIn Network',
      icon: <Linkedin className="h-5 w-5 text-blue-400" />,
      desc: 'Stay informed about corporate events and speakers.',
      link: 'https://linkedin.com/company/sample-tagdatech'
    }
  ];

  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-neonPurple/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header block */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold font-cyber tracking-wider text-white">GET IN TOUCH</h1>
          <p className="text-slate-400 text-sm">Have suggestions, sponsorship inquiries, or partnership proposals? Message the community board.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Direct channels left panel */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-cyber font-bold tracking-widest text-neonMagenta">DIRECT CHANNELS</h2>
            
            <div className="space-y-4">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-card p-4 flex items-start gap-4 hover:border-neonPurple/60 transition-all duration-300 block"
                >
                  <div className="bg-cyberDark p-2.5 rounded-lg border border-neonPurple/20">
                    {social.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-cyber font-semibold text-white text-sm">{social.name}</h3>
                    <p className="text-slate-400 text-xs font-sans">{social.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Inquiry form right panel */}
          <div className="lg:col-span-3 cyber-card p-6 md:p-8 space-y-6">
            <h2 className="text-lg font-cyber font-bold tracking-widest text-neonMagenta">INQUIRY FORM</h2>
            
            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg p-4 flex items-center gap-3 font-sans text-sm"
              >
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span>Message saved successfully! The admin team has received your submission.</span>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 flex items-center gap-3 font-sans text-sm"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-xs font-cyber text-slate-300 font-semibold uppercase">Your Name <span className="text-neonMagenta">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className="cyber-input"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-cyber text-slate-300 font-semibold uppercase">Your Email <span className="text-neonMagenta">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. john@example.com"
                    className="cyber-input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="block text-xs font-cyber text-slate-300 font-semibold uppercase">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Sponsorship Proposal"
                  className="cyber-input"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="block text-xs font-cyber text-slate-300 font-semibold uppercase">Message <span className="text-neonMagenta">*</span></label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your inquiry..."
                  className="cyber-input resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cyber-btn-primary w-full md:w-auto"
              >
                <Send className="h-4.5 w-4.5" />
                <span>{loading ? 'SENDING...' : 'SEND MESSAGE'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
