const { connectDB, getDB, closeConnection } = require('./database');

const cities = ['Bangalore', 'Mumbai', 'New Delhi', 'Bhubaneshwar', 'Hyderabad'];
const types = ['Rent', 'Buy'];
const propertyTypes = ['flat', 'house'];
const adjectives = ['Luxurious', 'Spacious', 'Cozy', 'Modern', 'Elegant', 'Affordable', 'Premium', 'Beautiful'];

const realEstateImages = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
  "https://images.unsplash.com/photo-1600607687920-4e2a09be1587",
  "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f",
  "https://images.unsplash.com/photo-1600566753086-00f18efc2291",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function seedDB() {
  try {
    await connectDB();
    const db = getDB();
    const propertiesCollection = db.collection('properties');

    // Check if already seeded
    const count = await propertiesCollection.countDocuments({});
    if (count > 0) {
      console.log("Database already seeded.");
      await closeConnection();
      return;
    }

    const properties = [];

    for (let city of cities) {
      for (let i = 0; i < 10; i++) {
        const t = getRandomElement(types);
        const pt = getRandomElement(propertyTypes);
        const beds = Math.floor(Math.random() * 5) + 1;
        const baths = Math.floor(Math.random() * beds) + 1;
        const area = Math.floor(Math.random() * 3500) + 500;
        
        let price;
        if (t === 'Rent') {
          price = Math.floor(Math.random() * 90000) + 10000;
        } else {
          price = Math.floor(Math.random() * 47000000) + 3000000;
        }

        const title = `${getRandomElement(adjectives)} ${beds} BHK ${pt.charAt(0).toUpperCase() + pt.slice(1)} in ${city}`;
        const description = `A wonderful ${beds} bedroom ${pt} located in the heart of ${city}. It offers great amenities and a comfortable living space of ${area} sqft.`;
        const imageUrl = `${getRandomElement(realEstateImages)}?auto=format&fit=crop&w=800&q=80`;

        properties.push({
          title,
          description,
          city,
          price,
          type: t,
          property_type: pt,
          bedrooms: beds,
          bathrooms: baths,
          area_sqft: area,
          image_url: imageUrl
        });
      }
    }

    const result = await propertiesCollection.insertMany(properties);
    console.log(`✓ Database seeded with ${result.insertedIds.length} properties.`);
    
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await closeConnection();
  }
}

seedDB();
