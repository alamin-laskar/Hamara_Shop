// server.js
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/html/list_item.html';

// Use connect method to connect to the Server
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }

  console.log('Connected to MongoDB');

  const db = client.db('shopList');
  const shopCollection = db.collection('shops');

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.post('/addShop', (req, res) => {
    const { shopName, category, location } = req.body;

    // Validate input
    if (!shopName || !category || !location) {
      res.status(400).send('Please provide all fields.');
      return;
    }

    // Insert the shop into the MongoDB collection
    shopCollection.insertOne({ shopName, category, location }, (err, result) => {
      if (err) {
        console.error('Error inserting shop:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      console.log('Shop added:', result.ops[0]);
      res.status(200).send('Shop added successfully');
    });
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
