const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const { connectDB, getDB, closeConnection } = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: "Roof Hunt Backend API is running", status: "healthy" });
});

app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

// GET all properties with filters
app.get('/properties', async (req, res) => {
  try {
    const db = getDB();
    const propertiesCollection = db.collection('properties');
    
    const { city, type, property_type, min_price, max_price } = req.query;
    let query = {};

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    if (type) {
      query.type = type;
    }
    if (property_type) {
      query.property_type = property_type;
    }
    if (min_price) {
      query.price = { $gte: parseInt(min_price) };
    }
    if (max_price) {
      if (query.price) {
        query.price.$lte = parseInt(max_price);
      } else {
        query.price = { $lte: parseInt(max_price) };
      }
    }

    const properties = await propertiesCollection.find(query).toArray();
    
    // Convert _id to string for JSON serialization
    const formattedProperties = properties.map(prop => ({
      ...prop,
      _id: prop._id.toString(),
      id: prop._id.toString()
    }));

    res.json(formattedProperties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single property by ID
app.get('/properties/:property_id', async (req, res) => {
  try {
    const db = getDB();
    const propertiesCollection = db.collection('properties');
    
    const property = await propertiesCollection.findOne({
      _id: new ObjectId(req.params.property_id)
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json({
      ...property,
      _id: property._id.toString(),
      id: property._id.toString()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// CREATE new property
app.post('/properties', async (req, res) => {
  try {
    const db = getDB();
    const propertiesCollection = db.collection('properties');

    const newProperty = {
      title: req.body.title,
      description: req.body.description,
      city: req.body.city,
      price: req.body.price,
      type: req.body.type,
      property_type: req.body.property_type,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      area_sqft: req.body.area_sqft,
      image_url: req.body.image_url
    };

    const result = await propertiesCollection.insertOne(newProperty);
    
    res.status(201).json({
      _id: result.insertedId.toString(),
      message: "Property created successfully"
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE property
app.put('/properties/:property_id', async (req, res) => {
  try {
    const db = getDB();
    const propertiesCollection = db.collection('properties');

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      city: req.body.city,
      price: req.body.price,
      type: req.body.type,
      property_type: req.body.property_type,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      area_sqft: req.body.area_sqft,
      image_url: req.body.image_url
    };

    const result = await propertiesCollection.updateOne(
      { _id: new ObjectId(req.params.property_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json({ message: "Property updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE property
app.delete('/properties/:property_id', async (req, res) => {
  try {
    const db = getDB();
    const propertiesCollection = db.collection('properties');

    const result = await propertiesCollection.deleteOne({
      _id: new ObjectId(req.params.property_id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await closeConnection();
  process.exit(0);
});

startServer();
