var constants = require('../constants.js');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: constants.title,
    description: constants.description,
    zrcTokenPropertiesMap: constants.zrcTokenPropertiesMap,
    ssnListMap: constants.ssnListMap
  });
});

module.exports = router;