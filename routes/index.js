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
      "coin_price_coingecko_timestamp_seconds",
      "coin_price_coingecko",
      "zilswap_dex_24h_trade_volume_timestamp_seconds",
      "zilswap_dex_24h_trade_volume",
      "zilswap_dex_epoch_info_timestamp_seconds",
      "zilswap_dex_epoch_info"
    ],
    function (err, reply) {
      let currZilswapDexSmartContractStateTimestampSeconds = null;
      let currZilswapDexSmartContractState = null;
      let currCoinPriceCoingeckoTimestampSeconds = null;
      let currCoinPriceCoingecko = null;
      let currZilswapDex24hTradeVolume = null;
      let currZilswapDex24hTradeVolumeTimestampSeconds = null;
      let currZilswapDexEpochInfo = null;
      let currZilswapDexEpochInfoTimestampSeconds = null;

      let currentDate = new Date();
      let currentTimeSeconds = currentDate.getTime() / 1000;

      if (!err && reply) {
        try {
          currZilswapDexSmartContractStateTimestampSeconds = parseInt(reply[0]);
          // Only use the cache if it's within 15 seconds.
          if (currentTimeSeconds - currZilswapDexSmartContractStateTimestampSeconds <= 15) {
            currZilswapDexSmartContractState = JSON.parse(reply[1]);
          }

          currCoinPriceCoingeckoTimestampSeconds = parseInt(reply[2]);
          // Only use the cache if it's within 15 seconds.
          if (currentTimeSeconds - currCoinPriceCoingeckoTimestampSeconds <= 15) {
            currCoinPriceCoingecko = JSON.parse(reply[3]);
          }
          
          currZilswapDex24hTradeVolumeTimestampSeconds = parseInt(reply[4]);
          // Only use the cache if it's within 15 seconds.
          if (currentTimeSeconds - currZilswapDex24hTradeVolumeTimestampSeconds <= 15) {
            currZilswapDex24hTradeVolume = JSON.parse(reply[5]);
          }

          currZilswapDexEpochInfoTimestampSeconds = parseInt(reply[6]);
          // Only use the cache if it's within 60 seconds.
          if (currentTimeSeconds - currZilswapDexEpochInfoTimestampSeconds <= 60) {
            currZilswapDexEpochInfo = JSON.parse(reply[7]);
          }

        } catch (ex) {
          console.log(ex);
        }
      }
      res.render('index', {
        title: constants.title,
        description: constants.description,
        coinMap: constants.coinMap,
        currencyMap: constants.currencyMap,
        zrcTokenPropertiesListMap: constants.zrcTokenPropertiesListMap,
        ssnListMap: constants.ssnListMap,
        zilswapDexSmartContractState: currZilswapDexSmartContractState,
        coinPriceCoingecko: currCoinPriceCoingecko,
        zilswapDex24hTradeVolume: currZilswapDex24hTradeVolume,
        zilswapDexEpochInfo: currZilswapDexEpochInfo,
      });
    });
});

module.exports = router;