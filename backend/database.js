const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb+srv://bishwaprakashrout2007_db_user:zxc4NQXUITPDOcVe@cluster0.l7hb4gt.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    db = client.db("roof_hunt_db");
    console.log("✓ Successfully connected to MongoDB!");
    return db;
  } catch (error) {
    console.error("✗ Failed to connect to MongoDB:", error);
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB() first.");
  }
  return db;
}

async function closeConnection() {
  await client.close();
  console.log("MongoDB connection closed");
}

module.exports = {
  connectDB,
  getDB,
  closeConnection,
  client
};
