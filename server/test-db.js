// Create this file as: test-db.js in your project root
const mongoose = require('mongoose');

// Replace with your actual MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/your_database_name';
// OR if using MongoDB Atlas:
// const MONGODB_URI = 'mongodb+srv://username:password@cluster.mongodb.net/database_name';

// Import your collection map
const collectionMap = require('./models/DataModel'); // Adjust path if needed

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function testCollections() {
  console.log('🔍 Testing all collections...\n');
  
  const collections = Object.keys(collectionMap);
  console.log('Available collections:', collections);
  
  for (const collection of collections) {
    try {
      const Model = collectionMap[collection];
      
      console.log(`\n📁 Collection: ${collection}`);
      console.log('='.repeat(50));
      
      // Get total count
      const count = await Model.countDocuments();
      console.log(`📊 Total documents: ${count}`);
      
      if (count > 0) {
        // Get sample document to see structure
        const sample = await Model.findOne();
        console.log('🔑 Available fields:', Object.keys(sample._doc));
        
        // Show first few characters of each field to understand data
        console.log('\n📝 Sample data preview:');
        for (const [key, value] of Object.entries(sample._doc)) {
          if (key === '_id' || key === '__v') continue;
          const preview = typeof value === 'string' ? 
            (value.length > 50 ? value.substring(0, 50) + '...' : value) : 
            value;
          console.log(`  ${key}: ${preview}`);
        }
      } else {
        console.log('⚠️  No documents found in this collection');
      }
      
    } catch (error) {
      console.error(`❌ Error with collection ${collection}:`, error.message);
    }
  }
  
  // Test search functionality
  console.log('\n\n🔍 Testing search functionality...');
  console.log('='.repeat(50));
  
  // You can modify these test queries based on your data
  const testQueries = [
    'test',
    '139',  // Common phone number start
    '@',    // Email symbol
    '2023', // Year
    'com'   // Domain
  ];
  
  for (const testQuery of testQueries) {
    console.log(`\n🔎 Testing query: "${testQuery}"`);
    
    for (const collection of collections) {
      try {
        const Model = collectionMap[collection];
        
        // Test with regex search on common fields
        const searchQuery = {
          $or: [
            // Chinese fields
            { '姓名': { $regex: testQuery, $options: 'i' } },
            { '手机': { $regex: testQuery, $options: 'i' } },
            { '邮箱': { $regex: testQuery, $options: 'i' } },
            { '联系人': { $regex: testQuery, $options: 'i' } },
            { '企业名称': { $regex: testQuery, $options: 'i' } },
            { '手机号': { $regex: testQuery, $options: 'i' } },
            { '电话': { $regex: testQuery, $options: 'i' } },
            { '联系方式': { $regex: testQuery, $options: 'i' } },
            // English fields
            { 'name': { $regex: testQuery, $options: 'i' } },
            { 'phone': { $regex: testQuery, $options: 'i' } },
            { 'email': { $regex: testQuery, $options: 'i' } },
            { 'phoneNumber': { $regex: testQuery, $options: 'i' } }
          ]
        };
        
        const results = await Model.find(searchQuery).limit(2);
        
        if (results.length > 0) {
          console.log(`  ✅ ${collection}: Found ${results.length} results`);
          console.log(`     Sample match:`, results[0]._doc);
        } else {
          console.log(`  ⚪ ${collection}: No results`);
        }
        
      } catch (error) {
        console.log(`  ❌ ${collection}: Error - ${error.message}`);
      }
    }
  }
}

async function main() {
  try {
    await connectDB();
    await testCollections();
    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
}

// Run the test
main();