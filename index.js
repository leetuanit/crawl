
const axios = require('axios');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  idp: {
    type: Number,
    unique: true
  },
  url: {
    type: String,
    unique: true
  },
  title: String
});
mongoose.connect('mongodb://localhost:27017/realestate', { useNewUrlParser: true, useCreateIndex: true });
const Properties = mongoose.model('properties', propertySchema);

let page = 2;
let crawl = function () {
  url = `https://alonhadat.com.vn/can-ban-nha/trang-${page}.htm`
  axios.get(url)
    .then(function (response) {
      let data = response.data.match(/\/[a-z-0-9]+-\d{3,7}.html/gm);
      if (!data) {
        clearInterval(run);
      }
      let unique = [...new Set(data)];
      unique.forEach(element => {
        let idp = element.match(/\d{3,7}/)[0];
        Properties.findOne({ 'idp': idp }, function (err, proper) {
          if (!proper) {
            console.log('no');
            const property = new Properties({ 'idp': idp, 'url': element });
            property.save().catch((err) => {
              throw err;
            });
          }
          if (err) throw err;
        });
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  page++;
};
let run = setInterval(crawl, 1000);
run;