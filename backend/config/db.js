const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tagdatech', {
      serverSelectionTimeoutMS: 2000 // Timeout fast if local Mongo is not running
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    console.warn('WARNING: Running without an active MongoDB connection. Ensure local MongoDB is running or configure MONGODB_URI.');
  }
};

module.exports = connectDB;
