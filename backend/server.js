const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = async () => {
  const connect = require('./config/db');
  await connect();
};

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration matching *.pages.dev and localhost origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or postman)
    if (!origin) return callback(null, true);
    
    const isPagesDev = /\.pages\.dev$/.test(origin);
    const isLocalhost = /^http:\/\/localhost(:\d+)?$/.test(origin);
    const isVercel = /\.vercel\.app$/.test(origin) || origin === 'https://tagdatech.vercel.app';
    
    if (isPagesDev || isLocalhost || isVercel) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Main Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Tagda Tech API Server is running.' });
});

// Import routers
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const noteRoutes = require('./routes/notes');
const announcementRoutes = require('./routes/announcements');
const messageRoutes = require('./routes/messages');

// Bind router middleware
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/messages', messageRoutes);

// Seeding function for default admin and initial showcase content
const seedData = async () => {
  try {
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    const Event = require('./models/Event');
    const Note = require('./models/Note');
    const Announcement = require('./models/Announcement');

    // 1. Seed Admin
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin_tagda_2026';

    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newAdmin = new User({
        username: adminUsername,
        password: hashedPassword,
        role: 'admin'
      });
      await newAdmin.save();
      console.log(`Seeded Default Admin: Username: "${adminUsername}" | Password: "${adminPassword}"`);
    }

    // 2. Seed Initial Events (if database is empty)
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      await Event.insertMany([
        {
          title: 'Tagda Tech Winter Hackathon',
          description: 'A 48-hour challenge to design solutions combating energy crises using sustainable IoT and cloud tech.',
          type: 'Hackathon',
          date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
          registrationLink: 'https://tagdatech.pages.dev/register/winter-hack',
          imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
          interactions: 42
        },
        {
          title: 'Valorant Community Clash',
          description: 'Showcase your skills in a 5v5 single elimination bracket. Prizes include exclusive Tagda merchandise and rank titles.',
          type: 'ESports',
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          registrationLink: 'https://tagdatech.pages.dev/register/val-clash',
          imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
          interactions: 128
        }
      ]);
      console.log('Seeded sample events.');
    }

    // 3. Seed Initial Notes (if database is empty)
    const noteCount = await Note.countDocuments();
    if (noteCount === 0) {
      await Note.insertMany([
        {
          title: 'Mastering React & Framer Motion',
          subject: 'Web Development',
          fileUrl: 'https://example.com/notes/react-animations.pdf',
          tags: ['React', 'Framer Motion', 'Tailwind'],
          downloads: 73
        },
        {
          title: 'MongoDB Aggregations Demystified',
          subject: 'Database Management',
          fileUrl: 'https://example.com/notes/mongodb-aggregations.pdf',
          tags: ['MongoDB', 'Backend', 'NoSQL'],
          downloads: 29
        }
      ]);
      console.log('Seeded sample notes.');
    }

    // 4. Seed Initial Announcements (if database is empty)
    const announcementCount = await Announcement.countDocuments();
    if (announcementCount === 0) {
      await Announcement.insertMany([
        {
          title: 'Official Discord Channel Launching soon!',
          content: 'We are setting up our official Discord channel to host server tournaments, game nights, and voice channels for developer stand-ups. Stay tuned!',
          isTimeBound: false,
          priority: 'High'
        },
        {
          title: 'Registration deadline for Valorant Clash extended',
          content: 'Due to popular demand, registrations have been extended until tomorrow midnight. Get your teams ready!',
          isTimeBound: true,
          expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          priority: 'Medium'
        }
      ]);
      console.log('Seeded sample announcements.');
    }

  } catch (error) {
    console.error('Error during data seeding:', error);
  }
};

// Start Server and Database
const PORT = process.env.PORT || 5000;
const start = async () => {
  await connectDB();
  await seedData();
  
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

start();
