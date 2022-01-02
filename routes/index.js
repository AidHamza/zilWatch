var constants = require('../constants.js');
var redisClient = require('../libraries/redis_client.js');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  let currTargetTokenSymbol = null;
  if (req.query.token && req.query.token in constants.zrcTokenPropertiesListMap) {
    currTargetTokenSymbol = req.query.token;
  }

  redisClient.mget(
    ["zilswap_dex_smart_contract_state_timestamp_seconds", // 0
      "zilswap_dex_smart_contract_state", // 1
      "zilswap_dex_smart_contract_state_24h_ago", // 2
      "coin_price_coingecko_timestamp_seconds", // 3
      "coin_price_coingecko", // 4
      "coin_price_coingecko_24h_ago", // 5
      "zilswap_dex_24h_trade_volume_timestamp_seconds", // 6
      "zilswap_dex_24h_trade_volume", // 7
      "coin_market_coingecko", // 8
      "zilswap_distributor_to_ticker_map", // 9
      "zrc_tokens_total_supply", // 10
      "zrc_tokens_circulating_supply", // 11
      "zrc_tokens_circulating_supply_sorted_market_cap", // 12
      "zilswap_dex_reward_and_apr", // 13
      "zil_staking_reward_and_apr", // 14
      "zrc_staking_reward_and_apr", // 15
      "zilswap_dex_zrc_tokens_price_in_zil_24h_low", // 16
      "zilswap_dex_zrc_tokens_price_in_zil_24h_high", // 17
      "xcad_dex_smart_contract_state_timestamp_seconds", // 18
      "xcad_dex_smart_contract_state", // 19
      "xcad_dex_smart_contract_state_24h_ago", // 20
      "xcad_dex_distributor_to_ticker_map", // 21
      "xcad_dex_reward_and_apr", // 22
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

      let currCoinMarketCoingecko = null; // 8

      let currZilswapDistributorToTickerMap = null; // 9

      let currZrcTokensTotalSupply = constants.emptyZrcTokensSupply; // 10
      let currZrcTokensCirculatingSupply = constants.emptyZrcTokensSupply; // 11 and 12

      let currZilswapDexReward = null; // 13
      let currZilStakingReward = null; // 14
      let currZrcStakingReward = null; // 15
      let currZrcTokenPrice24hLow = null; // 16
      let currZrcTokenPrice24hHigh = null; // 17

      let currXcadDexSmartContractStateTimestampSeconds = null; // 18
      let currXcadDexSmartContractState = null; // 19
      let currXcadDexSmartContractState24hAgo = null; // 20

      let currXcadDexDistributorToTickerMap = null; // 21
      let currXcadDexReward = null; // 22

      let currentDate = new Date();
      let currentTimeSeconds = currentDate.getTime() / 1000;

      if (!err && reply) {
        try {
          if (reply[0]) {
            currZilswapDexSmartContractStateTimestampSeconds = parseInt(reply[0]);
            // Only use the cache if it's within 60 seconds.
            if (currentTimeSeconds - currZilswapDexSmartContractStateTimestampSeconds <= 60 && reply[1]) {
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
            currCoinMarketCoingecko = JSON.parse(reply[8]);
          }

          if (reply[9]) {
            currZilswapDistributorToTickerMap = JSON.parse(reply[9]);
          }

          if (reply[10]) {
            currZrcTokensTotalSupply = JSON.parse(reply[10]);
          }
          // Get original circulating supply by alphabetical order first.
          if (reply[11]) {
            currZrcTokensCirculatingSupply = JSON.parse(reply[11]);
          }
          // If circulating supply by market cap exists, use this instead of alphabetical order.
          if (reply[12]) {
            currZrcTokensCirculatingSupply = JSON.parse(reply[12]);
          }

          if (reply[13]) {
            currZilswapDexReward = JSON.parse(reply[13]);
          }
          if (reply[14]) {
            currZilStakingReward = JSON.parse(reply[14]);
          }
          if (reply[15]) {
            currZrcStakingReward = JSON.parse(reply[15]);
          }

          if (reply[16]) {
            currZrcTokenPrice24hLow = JSON.parse(reply[16]);
          }
          if (reply[17]) {
            currZrcTokenPrice24hHigh = JSON.parse(reply[17]);
          }

          if (reply[18]) {
            currXcadDexSmartContractStateTimestampSeconds = parseInt(reply[18]);
            // Only use the cache if it's within 120 seconds.
            if (currentTimeSeconds - currXcadDexSmartContractStateTimestampSeconds <= 120 && reply[19]) {
              currXCADDexSmartContractState = JSON.parse(reply[19]);
            }
          }
          if (reply[20]) {
            currXcadDexSmartContractState24hAgo = JSON.parse(reply[20]);
          }
          if (reply[21]) {
            currXcadDexDistributorToTickerMap = JSON.parse(reply[21]);
          }
          if (reply[22]) {
            currXcadDexReward = JSON.parse(reply[22]);
          }

        } catch (ex) {
          console.log(ex);
        }
      }
      res.render('index', {
        title: 'zilWatch - Smart Dashboard for Zilliqa',
        description: 'View your Zilliqa (ZIL) wallet balances and current ZIL and ZRC-2 prices today in an all-in-one smart dashboard.',
        coinMap: constants.coinMap,
        currencyMap: constants.currencyMap,
        supportedDexToBaseTokenMap: constants.supportedDexToBaseTokenMap,
        zrcTokenPropertiesListMap: constants.zrcTokenPropertiesListMap,
        zrcStakingTokenPropertiesListMap: constants.zrcStakingTokenPropertiesListMap,
        nftTokenPropertiesListMap: constants.nftTokenPropertiesListMap,
        ssnListMap: constants.ssnListMap,
        targetTokenSymbol: currTargetTokenSymbol,
        zilswapDexSmartContractState: currZilswapDexSmartContractState,
        zilswapDexSmartContractState24hAgo: currZilswapDexSmartContractState24hAgo,
        coinPriceCoingecko: currCoinPriceCoingecko,
        coinPriceCoingecko24hAgo: currCoinPriceCoingecko24hAgo,
        zilswapDex24hTradeVolume: currZilswapDex24hTradeVolume,
        coinMarketCoingecko: currCoinMarketCoingecko,
        zilswapDistributorToTickerMap: currZilswapDistributorToTickerMap,
        zrcTokensTotalSupply: currZrcTokensTotalSupply,
        zrcTokensCirculatingSupply: currZrcTokensCirculatingSupply,
        zilswapDexReward: currZilswapDexReward,
        zilStakingReward: currZilStakingReward,
        zrcStakingReward: currZrcStakingReward,
        zrcTokenPrice24hLow: currZrcTokenPrice24hLow,
        zrcTokenPrice24hHigh: currZrcTokenPrice24hHigh,
        xcadDexSmartContractState: currXcadDexSmartContractState,
        xcadDexSmartContractState24hAgo: currXcadDexSmartContractState24hAgo,
        xcadDexDistributorToTickerMap: currXcadDexDistributorToTickerMap,
        xcadDexReward: currXcadDexReward,
      });
    });
});

module.exports = router;