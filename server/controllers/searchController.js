const { createCollectionModels, staticCollectionMap } = require('../models/DataModel');
const User = require('../models/User');

let collectionMap = null;

async function initializeCollectionMap() {
  if (!collectionMap) {
    try {
      collectionMap = await createCollectionModels();
    } catch (error) {
      collectionMap = staticCollectionMap;
    }
  }
  return collectionMap;
}

exports.search = async (req, res) => {
  try {
    const { query, type } = req.body;
    const userId = req.user.id;
    
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }
    
    const collections = await initializeCollectionMap();
    
    if (!collections || Object.keys(collections).length === 0) {
      return res.status(500).json({ message: 'No collections available for search' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.points < 1) {
      return res.status(400).json({ message: 'Insufficient points' });
    }
    
    const fieldMap = {
      phoneNumber: ['phone', 'phoneNumber', 'mobile', 'tel', 'telephone', 'cellphone', '手机', '联系方式', '手机号', '电话', '移动电话', '手机号码', '联系电话'],
      email: ['email', 'emailAddress', 'mail', 'e-mail', '邮箱', '电子邮箱', '邮件', '电子邮件', '邮箱地址'],
      idNumber: ['idNumber', 'ID', 'id', 'identityNumber', 'cardNumber', 'idCard', '身份证', '证件号码', '身份证号', '身份证号码', '证件号'],
      qqNumber: ['qq', 'qqNumber', 'QQ', 'qqID', 'qq号', 'QQ号', 'qq号码', 'QQ号码'],
      weChatID: ['wechat', 'WeChat', 'weChatID', 'wechatID', 'weChatNumber', '微信', '微信号', '微信号码', '微信ID', '微信账号'],
      weiboID: ['weibo', 'Weibo', 'weiboID', 'weiboNumber', '微博', '微博号', '微博ID', '微博账号']
    };
    
    const collectionNames = Object.keys(collections);
    let results = [];
    
    for (const collectionName of collectionNames) {
      try {
        const Model = collections[collectionName];
        let searchQuery = {};
        
        if (type && fieldMap[type]) {
          const fieldQueries = fieldMap[type].map(field => ({
            [field]: { $regex: query, $options: 'i' }
          }));
          searchQuery = { $or: fieldQueries };
        } else {
          const allFields = [
            'name', 'phone', 'email', 'idNumber', 'qq', 'wechat', 'weibo',
            'phoneNumber', 'qqNumber', 'weChatID', 'weiboID', 'address',
            'company', 'contact', 'mobile', 'title', 'description',
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
        
        const data = await Model.find(searchQuery).limit(20);
        
        if (data.length > 0) {
          const resultsWithSource = data.map(item => ({
            ...item._doc,
            source: collectionName,
            _id: item._id
          }));
          results = results.concat(resultsWithSource);
        }
      } catch (collectionError) {
        continue;
      }
    }
    
    user.points -= 1;
    await user.save();
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};