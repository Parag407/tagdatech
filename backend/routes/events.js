const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { adminVerify } = require('../middleware/auth');

// GET /api/events
// Public - Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
});

// POST /api/events
// Admin Protected - Create new event
router.post('/', adminVerify, async (req, res) => {
  try {
    const { title, description, type, date, registrationLink, imageUrl } = req.body;

    if (!title || !description || !type || !date || !registrationLink) {
      return res.status(400).json({ error: 'All fields except image URL are required' });
    }

    if (!['Hackathon', 'ESports'].includes(type)) {
      return res.status(400).json({ error: 'Type must be Hackathon or ESports' });
    }

    const newEvent = new Event({
      title,
      description,
      type,
      date,
      registrationLink,
      imageUrl
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// DELETE /api/events/:id
// Admin Protected - Delete an event
router.delete('/:id', adminVerify, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event successfully deleted', event: deletedEvent });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// PATCH /api/events/:id/join
// Public - Increment event interaction joins
router.patch('/:id/join', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $inc: { interactions: 1 } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ success: true, interactions: event.interactions });
  } catch (error) {
    console.error('Error tracking join interaction:', error);
    res.status(500).json({ error: 'Failed to record interaction' });
  }
});

module.exports = router;
