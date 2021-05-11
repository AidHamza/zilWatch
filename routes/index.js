var constants = require('../constants.js');
var redis = require('redis')
var express = require('express');
var router = express.Router();

// localhost, default port
var redisClient = redis.createClient();
redisClient.on("error", function (error) {
  console.error(error);
});

/* GET home page. */
router.get('/', function (req, res, next) {
  redisClient.mget(
    ["zilswap_dex_smart_contract_state_timestamp_seconds",
      "zilswap_dex_smart_contract_state",
      "zil_price_coingecko_timestamp_seconds",
      "zil_price_coingecko"
    ],
    function (err, reply) {
      let currZilswapDexSmartContractStateTimestampSeconds = null;
      let currZilswapDexSmartContractState = null;
      let currZilPriceCoingeckoTimestampSeconds = null;
      let currZilPriceCoingecko = null;

      let currentDate = new Date();
      let currentTimeSeconds = currentDate.getTime() / 1000;

      if (!err && reply) {
        try {
          currZilswapDexSmartContractStateTimestampSeconds = parseInt(reply[0]);
          // Only use the cache if it's within 15 seconds.
          if (currentTimeSeconds - currZilswapDexSmartContractStateTimestampSeconds <= 15) {
            currZilswapDexSmartContractState = JSON.parse(reply[1]);
          }

          currZilPriceCoingeckoTimestampSeconds = parseInt(reply[2]);
          // Only use the cache if it's within 15 seconds.
          if (currentTimeSeconds - currZilPriceCoingeckoTimestampSeconds <= 15) {
            currZilPriceCoingecko = JSON.parse(reply[3]);
          }
        } catch (ex) {
          console.log(ex);
        }
      }
      res.render('index', {
        title: constants.title,
        description: constants.description,
        currencyMap: constants.currencyMap,
        zrcTokenPropertiesListMap: constants.zrcTokenPropertiesListMap,
        ssnListMap: constants.ssnListMap,
        zilswapDexSmartContractState: currZilswapDexSmartContractState,
        zilPriceCoingecko: currZilPriceCoingecko
      });
    });
});

module.exports = router;