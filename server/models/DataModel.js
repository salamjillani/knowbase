// models/DataModel.js - Fixed Version
const mongoose = require('mongoose');

// Create a flexible schema that accepts any fields
const dataSchema = new mongoose.Schema({}, { 
  strict: false,  // Allow any fields
  minimize: false // Don't remove empty objects
});

// Function to dynamically create collection models
async function createCollectionModels() {
  const db = mongoose.connection.db;
  
  if (!db) {
    throw new Error('Database connection not established');
  }
  
  // Get all collections from the database
  const collections = await db.listCollections().toArray();
  const collectionMap = {};
  
  console.log('📁 Found collections in database:', collections.map(c => c.name));
  
  // Create models for each collection
  for (const collection of collections) {
    const collectionName = collection.name;
    
    // Skip system collections
    if (collectionName.startsWith('system.') || collectionName === 'users') {
      continue;
    }
    
    try {
      // Create or get existing model
      let model;
      if (mongoose.models[collectionName]) {
        model = mongoose.models[collectionName];
      } else {
        model = mongoose.model(collectionName, dataSchema, collectionName);
      }
      
      collectionMap[collectionName] = model;
      console.log(`✅ Created model for: ${collectionName}`);
    } catch (error) {
      console.error(`❌ Error creating model for ${collectionName}:`, error.message);
    }
  }
  
  return collectionMap;
}

// Static collection map as fallback (update these names based on your diagnostic results)
const staticCollectionMap = {
  'china-shopping-test': mongoose.model('ChinaShopping', dataSchema, 'china-shopping-test'),
  'dnf-test': mongoose.model('Dnf', dataSchema, 'dnf-test'),
  'shunfeng-test': mongoose.model('Shunfeng', dataSchema, 'shunfeng-test'),
  '个体工商-test': mongoose.model('Business', dataSchema, '个体工商-test'),
  '借贷数据8w-test': mongoose.model('Loan', dataSchema, '借贷数据8w-test'),
  '公安户籍-test': mongoose.model('Residence', dataSchema, '公安户籍-test'),
  '平安保险10w-test': mongoose.model('Insurance', dataSchema, '平安保险10w-test'),
  '微博数据-test': mongoose.model('Weibo', dataSchema, '微博数据-test')
};

// Export function to get collection models
module.exports = {
  createCollectionModels,
  staticCollectionMap,
  dataSchema
};