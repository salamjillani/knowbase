// controllers/searchController.js - Updated Version
const { createCollectionModels, staticCollectionMap } = require('../models/DataModel');
const User = require('../models/User');

let collectionMap = null;

// Initialize collection models on first use
async function initializeCollectionMap() {
  if (!collectionMap) {
    try {
      console.log('🔄 Initializing collection models...');
      collectionMap = await createCollectionModels();
      console.log('✅ Collection models initialized:', Object.keys(collectionMap));
    } catch (error) {
      console.error('❌ Failed to create dynamic collection models:', error);
      console.log('🔄 Falling back to static collection map...');
      collectionMap = staticCollectionMap;
    }
  }
  return collectionMap;
}

exports.search = async (req, res) => {
  try {
    const { query, type } = req.body;
    const userId = req.user.id;
    
    console.log('🔍 Search request:', { query, type, userId });
    
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }
    
    // Initialize collection models
    const collections = await initializeCollectionMap();
    
    if (!collections || Object.keys(collections).length === 0) {
      return res.status(500).json({ message: 'No collections available for search' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('👤 User points:', user.points);
    
    if (user.points < 1) {
      return res.status(400).json({ message: 'Insufficient points' });
    }
    
    // Enhanced field mapping for search
    const fieldMap = {
      phoneNumber: [
        // English variants
        'phone', 'phoneNumber', 'mobile', 'tel', 'telephone', 'cellphone',
        // Chinese variants
        '手机', '联系方式', '手机号', '电话', '移动电话', '手机号码', '联系电话'
      ],
      email: [
        // English variants
        'email', 'emailAddress', 'mail', 'e-mail',
        // Chinese variants
        '邮箱', '电子邮箱', '邮件', '电子邮件', '邮箱地址'
      ],
      idNumber: [
        // English variants
        'idNumber', 'ID', 'id', 'identityNumber', 'cardNumber', 'idCard',
        // Chinese variants
        '身份证', '证件号码', '身份证号', '身份证号码', '证件号'
      ],
      qqNumber: [
        // English variants
        'qq', 'qqNumber', 'QQ', 'qqID',
        // Chinese variants
        'qq号', 'QQ号', 'qq号码', 'QQ号码'
      ],
      weChatID: [
        // English variants
        'wechat', 'WeChat', 'weChatID', 'wechatID', 'weChatNumber',
        // Chinese variants
        '微信', '微信号', '微信号码', '微信ID', '微信账号'
      ],
      weiboID: [
        // English variants
        'weibo', 'Weibo', 'weiboID', 'weiboNumber',
        // Chinese variants
        '微博', '微博号', '微博ID', '微博账号'
      ]
    };
    
    const collectionNames = Object.keys(collections);
    console.log('📁 Searching in collections:', collectionNames);
    
    let results = [];
    
    for (const collectionName of collectionNames) {
      try {
        const Model = collections[collectionName];
        let searchQuery = {};
        
        if (type && fieldMap[type]) {
          // Search using specific field type
          const fieldQueries = fieldMap[type].map(field => ({
            [field]: { $regex: query, $options: 'i' }
          }));
          
          searchQuery = { $or: fieldQueries };
        } else {
          // Generic search across all common fields
          const allFields = [
            // Common English fields
            'name', 'phone', 'email', 'idNumber', 'qq', 'wechat', 'weibo',
            'phoneNumber', 'qqNumber', 'weChatID', 'weiboID', 'address',
            'company', 'contact', 'mobile', 'title', 'description',
            
            // Common Chinese fields
            '姓名', '手机', '联系方式', '手机号', '电话', '邮箱', '身份证', 
            '证件号码', 'qq号', '微信', '微信号', '微博', '微博号',
            '联系人', '企业名称', '产品名称', '地址', '企业地址', '收货地址',
            '公司名称', '联系地址', '详细地址', '姓名', '用户名', '客户名称'
          ];
          
          searchQuery = {
            $or: allFields.map(field => ({
              [field]: { $regex: query, $options: 'i' }
            }))
          };
        }
        
        console.log(`🔍 Searching collection "${collectionName}"`);
        console.log(`📝 Search query:`, JSON.stringify(searchQuery, null, 2));
        
        const data = await Model.find(searchQuery).limit(20);
        console.log(`📊 Found ${data.length} results in "${collectionName}"`);
        
        if (data.length > 0) {
          console.log(`📋 Sample result from "${collectionName}":`, JSON.stringify(data[0]._doc, null, 2));
          
          // Add source information to results
          const resultsWithSource = data.map(item => ({
            ...item._doc,
            source: collectionName,
            _id: item._id
          }));
          
          results = results.concat(resultsWithSource);
        }
        
      } catch (collectionError) {
        console.error(`❌ Error searching collection "${collectionName}":`, collectionError.message);
        continue;
      }
    }
    
    console.log(`🎯 Total results found: ${results.length}`);
    
    // Deduct points for the search
    user.points -= 1;
    await user.save();
    console.log('💰 Points deducted, new balance:', user.points);
    
    res.json(results);
    
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};