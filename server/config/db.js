const mongoose = require('mongoose');

let mongoServerInstance = null;

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    let uri = process.env.MONGO_URI;

    if (uri && uri.trim() !== '') {
      console.log('Connecting to specified MongoDB URI...');
      const conn = await mongoose.connect(uri);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }

    // Zero-config embedded MongoDB for seamless instant demonstration
    if (!mongoServerInstance) {
      console.log('⚠️  No MONGO_URI provided. Initializing in-memory embedded MongoDB instance...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServerInstance = await MongoMemoryServer.create();
    }

    uri = mongoServerInstance.getUri();
    
    const conn = await mongoose.connect(uri);
    console.log(`✅ Embedded In-Memory MongoDB Connected at ${uri}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

const closeDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    if (mongoServerInstance) {
      await mongoServerInstance.stop();
      mongoServerInstance = null;
    }
  } catch (error) {
    console.error('Error closing DB:', error);
  }
};

module.exports = { connectDB, closeDB };
