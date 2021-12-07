var redisClient = require('../libraries/redis_client.js');
var visitor = require('../libraries/universal_analytics_client.js');

var express = require('express');
var router = express.Router();

/* GET api for trade volume in Zilswap dex in the past N period. */
router.get('/', function (req, res, next) {
    visitor.pageview("/api/volume" + req.url, "https://zilwatch.io", "TradeVolume API").send();
    redisClient.get("zilswap_dex_trade_volume",
        function (err, reply) {
            let json_data_result = null;
            if (!err && reply) {
                try {
                    json_data_result = JSON.parse(reply);
                } catch (ex) {
                    console.log(ex);
                }
            }
            if (!json_data_result) {
                res.send("Data not available!");
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(json_data_result));
        });
});

module.exports = router;
