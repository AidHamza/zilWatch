var constants = require('../constants.js');

var ua = require('universal-analytics');
var ua_key = 'UA-194858212-1';
var visitor = ua(ua_key);

var redis = require('redis')
var express = require('express');
var router = express.Router();

// localhost, default port
var redisClient = redis.createClient();
redisClient.on("error", function (error) {
    console.error(error);
});

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