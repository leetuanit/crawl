const axios = require('axios');
require('./database/mongodb');
const Company = require('./models/Company');

let companies = [];
Company.find({}, function (err, docs) {
  if (err) throw err;
  docs.map((item, index) => {
    companies[index] = item.url
  });
});
let index = 0;
setInterval(function () {
  crawlCompany(companies[index]);
  index++
}, 1000);

let crawlCompany = function (companyLink) {

  axios.get('http://vtown.vn' + companyLink)
    .then(async function (response) {
      let html = response.data;
      let title_ = html.match(/<h1>.+<\/h1>/gm);
      let address_ = html.match(/<span itemprop="streetAddress">.+<\/span>/gm);
      let phone_ = html.match(/<span itemprop="telephone" style="display: none;">.+<\/span>/gm);
      let title = title_[0].split('<h1>')[1].split('</h1>')[0];
      let address = address_[0].split('<span itemprop="streetAddress">')[1].split('</span>')[0];
      let phone = phone_[0].split('<span itemprop="telephone" style="display: none;">')[1].split('</span>')[0];
      Company.findOneAndUpdate({ url: companyLink }, {
        title: await title,
        address: await address,
        phone: await phone
      }, function (err) {
        console.log(err)
      });

    })
    .catch(function (error) {
      console.log(error);
    });
}
