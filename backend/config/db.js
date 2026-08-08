import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas using the MONGO_URI from environment variables.
 * Exits the process on failure so the app doesn't run without a database.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
