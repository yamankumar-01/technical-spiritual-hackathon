import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbDir = path.resolve(__dirname, '../../.db_data');

let mongoMemoryInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tsh_hackathon';
  const forceMemory = process.env.USE_IN_MEMORY_DB === 'true';

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Clean stale lock file if left over from abrupt termination
  const lockFile = path.join(dbDir, 'mongod.lock');
  if (fs.existsSync(lockFile)) {
    try {
      fs.unlinkSync(lockFile);
    } catch (_) {}
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB connection lost.');
  });

  if (forceMemory) {
    console.log('⚡ Persistent embedded MongoDB selected.');
    mongoMemoryInstance = await MongoMemoryServer.create({
      instance: {
        dbPath: dbDir,
        storageEngine: 'wiredTiger',
      },
    });
    const memUri = mongoMemoryInstance.getUri();
    await mongoose.connect(memUri);
    console.log(`✅ Connected to Persistent Embedded MongoDB at: ${memUri} [Storage: ${dbDir}]`);
    return;
  }

  try {
    // Attempt connecting to configured MongoDB instance with a short timeout
    console.log(`🔌 Attempting connection to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log('✅ MongoDB connected successfully to external/local instance.');
  } catch (error) {
    console.warn(`⚠️ Could not connect to local/external MongoDB (${error.message}).`);
    console.log('🚀 Launching persistent embedded MongoMemoryServer to store data reliably on disk...');
    try {
      mongoMemoryInstance = await MongoMemoryServer.create({
        instance: {
          dbPath: dbDir,
          storageEngine: 'wiredTiger',
        },
      });
      const memUri = mongoMemoryInstance.getUri();
      await mongoose.connect(memUri);
      console.log(`✅ Connected to Persistent Embedded MongoDB at: ${memUri} [Storage: ${dbDir}]`);
    } catch (memErr) {
      console.error('❌ Failed to start Embedded MongoDB:', memErr);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryInstance) {
      await mongoMemoryInstance.stop();
      mongoMemoryInstance = null;
    }
  } catch (err) {
    console.error('Error closing DB:', err.message);
  }
};
