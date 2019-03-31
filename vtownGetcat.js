
const axios = require('axios');
require('./database/mongodb');
const Company = require('./models/Company');

let page = 1;
let crawl = function () {
  url = `http://vtown.vn/top-viewed-companies.html?sort=company_name`;
  if (page !== 1) {
    url = `http://vtown.vn/top-viewed-companies.html?sort=company_name&Company_page=${page}`;
  }
  axios.get(url)
    .then(function (response) {
      let data = response.data.match(/\/company\/[a-z-0-9]+.html/gm);
      if (!data) {
        clearInterval(run);
      }
      let unique = [...new Set(data)];
      unique.forEach(element => {
        Company.findOne({ 'url': element }, function (err, proper) {
          if (!proper) {
            console.log('no');
            const company = new Company({ 'url': element });
            company.save().catch((err) => {
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
let run = setInterval(crawl, 2000);
run;