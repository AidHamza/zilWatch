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

/* GET api for individual token price, directly queried from redis. */
router.get('/prevepoch', function (req, res, next) {
    visitor.pageview("/api/reward" + req.url, "https://zilwatch.io", "Reward API").send();

    let tokenSymbol = req.query.token_symbol;
    let walletAddress = req.query.wallet_address;
    if (!tokenSymbol || !walletAddress) {
        res.send("Unsupported query parameters!");
        return;
    }
    if (tokenSymbol.toLowerCase() !== 'zwap') {
        res.send("Unsupported query parameters!");
        return;
    }
    redisClient.get("zilswap_distribution_data_prev_epoch",
        function (err, reply) {
            let data_arr = null;
            let json_data_result = [];
            if (!err && reply) {
                try {
                    data_arr = JSON.parse(reply);
                    for (let i = 0; i < data_arr.length; i++) {
                        if ('address_bech32' in data_arr[i] && data_arr[i]['address_bech32'] === walletAddress) {
                            // Found the wallet, just return one, data contains only single epoch for now.
                            json_data_result.push(data_arr[i]);
                            break;
                        }
                    }
                } catch (ex) {
                    console.log(ex);
                }
            }
            if (json_data_result.length == 0) {
                res.send("Data not available!");
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(json_data_result));
        });
});

module.exports = router;
