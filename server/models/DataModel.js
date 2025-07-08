const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({}, { strict: false });

const collectionMap = {
  'china-shopping-test': mongoose.model('ChinaShopping', dataSchema, 'china-shopping-test'),
  'dnf-test': mongoose.model('Dnf', dataSchema, 'dnf-test'),
  'shunfeng-test': mongoose.model('Shunfeng', dataSchema, 'shunfeng-test'),
  '个体工商-test': mongoose.model('Business', dataSchema, '个体工商-test'),
  '借贷数据8w-test': mongoose.model('Loan', dataSchema, '借贷数据8w-test'),
  '公安户籍-test': mongoose.model('Residence', dataSchema, '公安户籍-test'),
  '平安保险10w-test': mongoose.model('Insurance', dataSchema, '平安保险10w-test'),
  '微博数据-test': mongoose.model('Weibo', dataSchema, '微博数据-test')
};

module.exports = collectionMap;