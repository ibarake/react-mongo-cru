// Simple test script to verify MongoDB connection
// This can be run with node to test the database connection

const { MongoClient } = require('mongodb');

// MongoDB connection string from the challenge
const connectionString = 'mongodb+srv://drenviochallenge:m1jWly3uw42cBwp6@drenviochallenge.2efc0.mongodb.net/';
const databaseName = 'tienda';

async function testConnection() {
  let client;
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    client = new MongoClient(connectionString);
    await client.connect();
    
    console.log('✅ Successfully connected to MongoDB!');
    
    const db = client.db(databaseName);
    
    // Test access to productos collection
    const productCollection = db.collection('productos');
    const productCount = await productCollection.countDocuments();
    console.log(`📦 Products collection has ${productCount} documents`);
    
    // Test if we can create special prices collection
    const specialPricesCollection = db.collection('preciosEspecialesBarake78');
    const specialPricesCount = await specialPricesCollection.countDocuments();
    console.log(`💰 Special prices collection has ${specialPricesCount} documents`);
    
    // Test creating indexes on special prices collection
    try {
      await specialPricesCollection.createIndex({ userId: 1 });
      await specialPricesCollection.createIndex({ productId: 1 });
      await specialPricesCollection.createIndex({ userId: 1, productId: 1 }, { unique: true });
      console.log('📑 Indexes created successfully');
    } catch (error) {
      console.log('📑 Indexes may already exist');
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('🔒 Connection closed');
    }
  }
}

// Run the test
testConnection().catch(console.error); 