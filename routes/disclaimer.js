var express = require('express');
var router = express.Router();

/* GET disclaimer. */
router.get('/', function(req, res, next) {
    res.render('disclaimer', {
        title: 'zilWatch - Disclaimer',
        description: 'Disclaimer for using zilWatch services.',
      });
});

module.exports = router;
