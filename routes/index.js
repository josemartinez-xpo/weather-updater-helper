var express = require('express');
const fs = require('fs');
var jsdom = require('jsdom');
var router = express.Router();

const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'ext_webteam',
  host: '10.1.50.194',
  database: 'xpogisdb',
  password: 'WebT3am19',
  port: 5432,
});

/* GET home page. */
router.get('/', function(req, res, next) {
  const dom = getDOM();
  const weatherSection = dom.window.document.querySelector('#weather-section');
  res.render('index', { title: 'Weather Alert Updater', html: weatherSection.innerHTML });
});

router.post('/update', function (req, res, next) {
  const dom = getDOM();
  const weatherSection = dom.window.document.querySelector('#weather-section');
  weatherSection.innerHTML = req.body.content;
  fs.writeFile('./weather-alert.htm', dom.window.document.documentElement.outerHTML, function(err) {
    if (err) { console.error(err); }
  });
  fs.writeFileSync('./weather-alert', dom.window.document.documentElement.outerHTML);
  res.redirect('/');
});

function getDOM() {
  const f = fs.readFileSync('./weather-alert', 'utf8');
  return new jsdom.JSDOM(f);
}

module.exports = router;
