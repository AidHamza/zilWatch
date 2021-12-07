var constants = require('../constants.js');
var redisClient = require('../libraries/redis_client.js');
var visitor = require('../libraries/universal_analytics_client.js');
var express = require('express');
var router = express.Router();

/* GET api for individual token price, directly queried from redis. */
router.get('/', function (req, res, next) {
    visitor.pageview("/api/nft" + req.url, "https://zilwatch.io", "NFT API").send();

    let walletAddress = req.query.wallet_address;
    if (!walletAddress) {
        res.send("Unsupported query parameters!");
        return;
    }
    // This is wallet address base 16 lowercase
    let walletAddressBase16LowerCase = walletAddress.toLowerCase();

    redisClient.get("all_nft_collections",
        function (err, reply) {
            let data_dict_result = {};
            if (!err && reply) {
                try {
                    let data_dict = JSON.parse(reply);
                    
                    for (let nftTicker in constants.nftTokenPropertiesListMap) {
                        if (!(nftTicker in data_dict)) {
                            continue;
                        }
                        let currNftTickerCollections = data_dict[nftTicker];
                        if (walletAddressBase16LowerCase in currNftTickerCollections) {
                            data_dict_result[nftTicker] = currNftTickerCollections[walletAddressBase16LowerCase];
                        }
                    }
                } catch (ex) {
                    console.log(ex);
                }
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data_dict_result));
        });
});

module.exports = router;
