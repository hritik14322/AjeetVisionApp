const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const localUri = process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/new-ajeet-vision';

  if (primaryUri) {
    try {
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 3500,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.warn(`Primary MongoDB connection error (${err.message}). Switching to local fallback...`);
    }
  }

  try {
    const localConn = await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`Fallback MongoDB Connected Locally: ${localConn.connection.host}`);
  } catch (localErr) {
    console.error(`MongoDB Local Connection Error: ${localErr.message}`);
  }
};

module.exports = connectDB;
