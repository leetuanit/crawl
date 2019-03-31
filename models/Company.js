const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const companySchema = new Schema({
  url: {
    type: String,
    unique: true
  },
  title: String,
  address: String,
  phone: String
});
const Companies = mongoose.model('companies', companySchema);

module.exports = Companies;