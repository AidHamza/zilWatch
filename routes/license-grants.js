var express = require('express');
var router = express.Router();

/* GET license-grants. */
router.get('/', function(req, res, next) {
  res.send('None.');
});

module.exports = router;
