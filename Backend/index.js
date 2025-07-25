// index.js
require('dotenv').config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());


const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let dbConnected = false;

async function connectToAtlas() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    dbConnected = true;
    console.log("✅ Connected to MongoDB Atlas!");
  } catch (err) {
    dbConnected = false;
    console.error("❌ Atlas connection error:", err);
  }
}

connectToAtlas();

// Sample route
app.get("/", (req, res) => {
  if (dbConnected) {
    res.send("Node.js connected to MongoDB Atlas!");
  } else {
    res.status(500).send("Not connected to MongoDB Atlas.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
