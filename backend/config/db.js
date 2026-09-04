const mongoose = require('mongoose');

async function connectDB() {
  const mongoURI = process.env.MONGO_URL || process.env.MONGODB_URI;

  if (!mongoURI) {
    console.warn('[DB] No MONGO_URL found in environment. Using in-memory fallback.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[DB] MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[DB] MongoDB Connection Error: ${error.message}`);
    return false;
  }
}

module.exports = connectDB;
