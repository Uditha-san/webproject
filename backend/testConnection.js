const { MongoClient, ServerApiVersion } = require('mongodb');

// Replace <db_password> with your actual password
const uri = "mongodb+srv://akalankasenanayake88:gvvJYI3XkAQtLu3v@cluster0.nxpgjra.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    // Close the client when finished/error
    await client.close();
  }
}

run();
