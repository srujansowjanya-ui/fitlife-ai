import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitlife-ai';
  
  if (process.env.USE_MOCK_DB === 'true') {
    console.warn('⚠️ [DB] USE_MOCK_DB is enabled. Running with in-memory database mock.');
    global.isMockDatabase = true;
    return null;
  }

  try {
    // Set database connection timeout options
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30s
    });
    console.log(`📡 [MongoDB] Connected: ${conn.connection.host}`);
    global.isMockDatabase = false;
    return conn;
  } catch (error) {
    console.error(`❌ [MongoDB] Connection error: ${error.message}`);
    console.warn('⚠️ [DB] Falling back to IN-MEMORY MOCK DATABASE. The application will function normally for demo purposes.');
    global.isMockDatabase = true;
    return null;
  }
};

export default connectDB;
