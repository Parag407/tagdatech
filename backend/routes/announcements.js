const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { adminVerify } = require('../middleware/auth');

// GET /api/announcements
// Public - Retrieve all active announcements.
// Filters out time-bound ones that have expired relative to current server time.
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    
    // Find announcements that are either not time-bound OR have an expiryDate in the future
    const announcements = await Announcement.find({
      $or: [
        { isTimeBound: false },
        { isTimeBound: true, expiryDate: { $gt: now } }
      ]
    }).sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Failed to retrieve announcements' });
  }
});

// GET /api/announcements/admin
// Admin Protected - Retrieve ALL announcements (including expired ones) for management
router.get('/admin', adminVerify, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching admin announcements:', error);
    res.status(500).json({ error: 'Failed to retrieve announcements' });
  }
});

// POST /api/announcements
// Admin Protected - Create new announcement
router.post('/', adminVerify, async (req, res) => {
  try {
    const { title, content, isTimeBound, expiryDate, priority } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    if (isTimeBound && !expiryDate) {
      return res.status(400).json({ error: 'Expiry date is required for time-bound announcements' });
    }

    const newAnnouncement = new Announcement({
      title,
      content,
      isTimeBound: !!isTimeBound,
      expiryDate: isTimeBound ? expiryDate : undefined,
      priority: priority || 'Medium'
    });

    const savedAnnouncement = await newAnnouncement.save();
    res.status(201).json(savedAnnouncement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// DELETE /api/announcements/:id
// Admin Protected - Delete announcement
router.delete('/:id', adminVerify, async (req, res) => {
  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);
    if (!deletedAnnouncement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    res.json({ message: 'Announcement successfully deleted', announcement: deletedAnnouncement });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

module.exports = router;
