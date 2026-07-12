const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Hackathon', 'ESports'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  registrationLink: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  interactions: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema);
