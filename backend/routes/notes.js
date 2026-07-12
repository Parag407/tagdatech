const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { adminVerify } = require('../middleware/auth');

// GET /api/notes
// Public - Get all educational notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to retrieve notes' });
  }
});

// POST /api/notes
// Admin Protected - Upload/publish new note metadata
router.post('/', adminVerify, async (req, res) => {
  try {
    const { title, subject, fileUrl, tags } = req.body;

    if (!title || !subject || !fileUrl) {
      return res.status(400).json({ error: 'Title, subject, and note file URL are required' });
    }

    const newNote = new Note({
      title,
      subject,
      fileUrl,
      tags: tags || []
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error('Error creating note entry:', error);
    res.status(500).json({ error: 'Failed to create note entry' });
  }
});

// DELETE /api/notes/:id
// Admin Protected - Remove note entry
router.delete('/:id', adminVerify, async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note successfully removed', note: deletedNote });
  } catch (error) {
    console.error('Error removing note entry:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// PATCH /api/notes/:id/download
// Public - Track download metrics for a note
router.patch('/:id/download', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ success: true, downloads: note.downloads });
  } catch (error) {
    console.error('Error tracking download:', error);
    res.status(500).json({ error: 'Failed to record download analytics' });
  }
});

module.exports = router;
