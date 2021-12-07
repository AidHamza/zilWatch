var redisClient = require('../libraries/redis_client.js');
var visitor = require('../libraries/universal_analytics_client.js');

var express = require('express');
var router = express.Router();

/* GET api for historical coingecko state a given range (e.g., 24h). */
router.get('/coingecko', function (req, res, next) {
    visitor.pageview("/api/historical" + req.url, "https://zilwatch.io", "Historical API").send();

    let queryRange = req.query.range;
    if (!queryRange) {
        res.send("Unsupported query parameters!");
        return;
    }

    let redis_key_range = "coin_price_coingecko_" + queryRange + "_ago";

    redisClient.get(redis_key_range,
        function (err, reply) {
            let result = null;
            if (!err && reply) {
                try {
                    result = JSON.parse(reply);
                } catch (ex) {
                    console.log(ex);
                }
            }
            if (!result) {
                res.send("Data not available!");
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        });
});


/* GET api for zilswap dex pool state a given range (e.g., 24h). */
router.get('/zilswapdex-contractstate', function (req, res, next) {
    visitor.pageview("/api/historical" + req.url, "https://zilwatch.io", "Historical API").send();

    let queryRange = req.query.range;
    if (!queryRange) {
        res.send("Unsupported query parameters!");
        return;
    }

    let redis_key_range = "zilswap_dex_smart_contract_state_" + queryRange + "_ago";

    redisClient.get(redis_key_range,
        function (err, reply) {
            let result = null;
            if (!err && reply) {
                try {
                    result = JSON.parse(reply);
                } catch (ex) {
                    console.log(ex);
                }
            }
            if (!result) {
                res.send("Data not available!");
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        });
});

module.exports = router;