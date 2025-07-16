// database-diagnostic.js
const mongoose = require('mongoose');

// Replace with your actual MongoDB connection string
const MONGODB_URI = 'mongodb://daroot:Ubuntu123%21@dc.obash.cc:21017/dabase?authSource=admin';

async function diagnoseDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get the native MongoDB connection
    const db = mongoose.connection.db;
    
    console.log('\n🔍 Diagnostic Report');
    console.log('='.repeat(50));
    
    // 1. Check database name
    console.log(`📊 Database name: ${db.databaseName}`);
    
    // 2. List all collections in the database
    const collections = await db.listCollections().toArray();
    console.log(`\n📁 Total collections found: ${collections.length}`);
    
    if (collections.length === 0) {
      console.log('❌ No collections found in this database!');
      console.log('💡 This suggests either:');
      console.log('   1. Wrong database name in connection string');
      console.log('   2. No data has been imported yet');
      console.log('   3. Data is in a different database');
      return;
    }
    
    console.log('\n📋 Available collections:');
    for (const collection of collections) {
      console.log(`  - ${collection.name}`);
    }
    
    // 3. Check each collection for documents
    console.log('\n📊 Document counts per collection:');
    for (const collection of collections) {
      try {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`  ${collection.name}: ${count} documents`);
        
        if (count > 0) {
          // Get sample document
          const sample = await db.collection(collection.name).findOne();
          console.log(`    Sample fields: ${Object.keys(sample).join(', ')}`);
        }
      } catch (error) {
        console.log(`  ${collection.name}: Error - ${error.message}`);
      }
    }
    
    // 4. Test if our model mapping is correct
    console.log('\n🔧 Testing model mapping:');
    const expectedCollections = [
      'china-shopping-test',
      'dnf-test', 
      'shunfeng-test',
      '个体工商-test',
      '借贷数据8w-test',
      '公安户籍-test',
      '平安保险10w-test',
      '微博数据-test'
    ];
    
    for (const expected of expectedCollections) {
      const exists = collections.find(c => c.name === expected);
      if (exists) {
        console.log(`  ✅ ${expected} - Found`);
      } else {
        console.log(`  ❌ ${expected} - Not found`);
        
        // Look for similar names
        const similar = collections.filter(c => 
          c.name.includes(expected.replace('-test', '')) ||
          expected.includes(c.name.replace('-test', ''))
        );
        
        if (similar.length > 0) {
          console.log(`    💡 Similar: ${similar.map(s => s.name).join(', ')}`);
        }
      }
    }
    
    // 5. Check if we're connecting to the right database
    console.log('\n🔍 Database investigation:');
    const admin = db.admin();
    const dbs = await admin.listDatabases();
    
    console.log('📚 All databases on this MongoDB instance:');
    for (const database of dbs.databases) {
      console.log(`  - ${database.name} (${database.sizeOnDisk ? Math.round(database.sizeOnDisk / 1024 / 1024) + 'MB' : 'empty'})`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔒 Database connection closed');
  }
}

// Run the diagnostic
diagnoseDatabase();