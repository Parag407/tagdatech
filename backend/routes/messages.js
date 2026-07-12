const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { adminVerify } = require('../middleware/auth');

// POST /api/messages
// Public - Submit contact/inquiry form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const newMessage = new Message({
      name,
      email,
      subject: subject || 'No Subject',
      message
    });

    const savedMessage = await newMessage.save();
    res.status(201).json({ success: true, message: 'Message sent successfully!', data: savedMessage });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Failed to process and send message' });
  }
});

// GET /api/messages
// Admin Protected - Fetch all inquiries for dashboard view
router.get('/', adminVerify, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
});

// DELETE /api/messages/:id
// Admin Protected - Delete/dismiss message
router.delete('/:id', adminVerify, async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message successfully deleted', messageObj: deletedMessage });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
