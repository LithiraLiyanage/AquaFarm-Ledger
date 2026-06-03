import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;

export const connectDB = async () => {
  let uri = process.env.MONGO_URI;
  try {
    if (!uri) {
      try {
        // Try to start an in-memory MongoDB (useful for local dev without Mongo installed)
        mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
        console.log('Using in-memory MongoDB at', uri);
      } catch (memErr) {
        // If in-memory server fails (binary download/startup), fallback to local MongoDB
        console.warn('In-memory MongoDB failed to start:', memErr.message || memErr);
        uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aquafarm_ledger';
        console.warn('Falling back to local MongoDB URI:', uri);
      }
    }

    // Attempt to connect with a longer server selection timeout for flaky networks
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 30000 });
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message || error);
    console.error('To run locally, either start a MongoDB instance (mongod) or run Mongo via Docker:');
    console.error("  docker run -d -p 27017:27017 --name mongodev mongo:6.0");
    process.exit(1);
  }
};
