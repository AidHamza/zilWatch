var express = require('express');
var router = express.Router();

/* GET terms. */
router.get('/', function(req, res, next) {
    res.render('terms', {
        title: 'zilWatch - Terms of service',
        description: 'Terms of service for using zilWatch services.',
      });
});

module.exports = router;
