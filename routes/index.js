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
      "zilswap_dex_smart_contract_state_24h_ago",
      "coin_price_coingecko_timestamp_seconds",
      "coin_price_coingecko",
      "coin_price_coingecko_24h_ago",
      "zilswap_dex_24h_trade_volume_timestamp_seconds",
      "zilswap_dex_24h_trade_volume",
      "zilswap_dex_epoch_info_timestamp_seconds",
      "zilswap_dex_epoch_info",
      "zrc_tokens_total_supply",
      "zrc_tokens_circulating_supply",
      "zilswap_dex_reward_and_apr",
      "zil_staking_reward_and_apr",
      "coin_market_coingecko",
      "zilswap_dex_zrc_tokens_price_in_zil_24h_low",
      "zilswap_dex_zrc_tokens_price_in_zil_24h_high",
    ],
    function (err, reply) {
      let currZilswapDexSmartContractStateTimestampSeconds = null; // 0
      let currZilswapDexSmartContractState = null; // 1
      let currZilswapDexSmartContractState24hAgo = null; // 2

      let currCoinPriceCoingeckoTimestampSeconds = null; // 3
      let currCoinPriceCoingecko = null; // 4
      let currCoinPriceCoingecko24hAgo = null; // 5

      let currZilswapDex24hTradeVolumeTimestampSeconds = null; // 6
      let currZilswapDex24hTradeVolume = null; // 7

      let currZilswapDexEpochInfoTimestampSeconds = null; // 8
      let currZilswapDexEpochInfo = null; // 9

      let currZrcTokensTotalSupply = constants.emptyZrcTokensSupply; // 10
      let currZrcTokensCirculatingSupply = constants.emptyZrcTokensSupply; // 11

      let currZilswapDexReward = null; // 12
      let currZilStakingReward = null; // 13

      let currCoinMarketCoingecko = null; // 14

      let currZrcTokenPrice24hLow = null // 15
      let currZrcTokenPrice24hHigh = null // 16

      let currentDate = new Date();
      let currentTimeSeconds = currentDate.getTime() / 1000;

      if (!err && reply) {
        try {
          if (reply[0]) {
            currZilswapDexSmartContractStateTimestampSeconds = parseInt(reply[0]);
            // Only use the cache if it's within 20 seconds.
            if (currentTimeSeconds - currZilswapDexSmartContractStateTimestampSeconds <= 20 && reply[1]) {
              currZilswapDexSmartContractState = JSON.parse(reply[1]);
            }
          }
          if (reply[2]) {
            currZilswapDexSmartContractState24hAgo = JSON.parse(reply[2]);
          }

          if (reply[3]) {
            currCoinPriceCoingeckoTimestampSeconds = parseInt(reply[3]);
            // Only use the cache if it's within 200 seconds.
            if (currentTimeSeconds - currCoinPriceCoingeckoTimestampSeconds <= 200 && reply[4]) {
              currCoinPriceCoingecko = JSON.parse(reply[4]);
            }
          }
          if (reply[5]) {
            currCoinPriceCoingecko24hAgo = JSON.parse(reply[5]);
          }
          
          if (reply[6]) {
            currZilswapDex24hTradeVolumeTimestampSeconds = parseInt(reply[6]);
            // Only use the cache if it's within 200 seconds.
            if (currentTimeSeconds - currZilswapDex24hTradeVolumeTimestampSeconds <= 200 && reply[7]) {
              currZilswapDex24hTradeVolume = JSON.parse(reply[7]);
            }
          }

          if (reply[8]) {
            currZilswapDexEpochInfoTimestampSeconds = parseInt(reply[8]);
            // Only use the cache if it's within 300 seconds.
            if (currentTimeSeconds - currZilswapDexEpochInfoTimestampSeconds <= 300 && reply[9]) {
              currZilswapDexEpochInfo = JSON.parse(reply[9]);
            }
          }
          
          if (reply[10]) {
            currZrcTokensTotalSupply = JSON.parse(reply[10]);
          }
          if (reply[11]) {
            currZrcTokensCirculatingSupply = JSON.parse(reply[11]);
          }
          if (reply[12]) {
            currZilswapDexReward = JSON.parse(reply[12]);
          }
          if (reply[13]) {
            currZilStakingReward = JSON.parse(reply[13]);
          }

          if (reply[14]) {
            currCoinMarketCoingecko = JSON.parse(reply[14]);
          }

          if (reply[15]) {
            currZrcTokenPrice24hLow = JSON.parse(reply[15]);
          }
          if (reply[16]) {
            currZrcTokenPrice24hHigh = JSON.parse(reply[16]);
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
        zilswapDexSmartContractState24hAgo: currZilswapDexSmartContractState24hAgo,
        coinPriceCoingecko: currCoinPriceCoingecko,
        coinPriceCoingecko24hAgo: currCoinPriceCoingecko24hAgo,
        zilswapDex24hTradeVolume: currZilswapDex24hTradeVolume,
        zilswapDexEpochInfo: currZilswapDexEpochInfo,
        zrcTokensTotalSupply: currZrcTokensTotalSupply,
        zrcTokensCirculatingSupply: currZrcTokensCirculatingSupply,
        zilswapDexReward: currZilswapDexReward,
        zilStakingReward: currZilStakingReward,
        coinMarketCoingecko: currCoinMarketCoingecko,
        zrcTokenPrice24hLow: currZrcTokenPrice24hLow,
        zrcTokenPrice24hHigh: currZrcTokenPrice24hHigh,
      });
    });
});

module.exports = router;