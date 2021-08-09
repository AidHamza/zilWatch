var ua = require('universal-analytics');
var visitor = ua('UA-194858212-1');

var redis = require('redis')
var express = require('express');
var router = express.Router();

// localhost, default port
var redisClient = redis.createClient();
redisClient.on("error", function (error) {
  console.error(error);
});

/* GET api for token price, directly queried from redis. */
router.get('/', function (req, res, next) {
  visitor.pageview("/api/tokenprice" + req.url, "https://zilwatch.io", "Token Price API").send();

  let tokenSymbol = req.query.token_symbol;
  let range = req.query.range;
  if (!tokenSymbol || !range) {
    res.send("Unsupported query parameters!");
    return;
  }

  let redis_key = "zilswap_dex_zrc_tokens_price_in_zil_" + range + "_" + tokenSymbol;
  let redis_key_high = "zilswap_dex_zrc_tokens_price_in_zil_" + range + "_high";
  let redis_key_low = "zilswap_dex_zrc_tokens_price_in_zil_" + range + "_low";

  redisClient.mget(
    [redis_key,
      redis_key_high,
      redis_key_low
    ],
    function (err, reply) {
      let data_arr = null;
      let data_high = null;
      let data_low = null
      if (!err && reply) {
        try {
          if (reply[0]) {
            data_arr = JSON.parse(reply[0]);
          }
          if (reply[1]) {
            curr_data_high = JSON.parse(reply[1]);
            if (tokenSymbol in curr_data_high) {
              data_high = curr_data_high[tokenSymbol];
            }
          }
          if (reply[2]) {
            curr_data_low = JSON.parse(reply[2]);
            if (tokenSymbol in curr_data_low) {
              data_low = curr_data_low[tokenSymbol];
            }
          }
        } catch (ex) {
          console.log(ex);
        }
      }
      if (!data_arr) {
        res.send("Data not available!");
        return;
      }
      let dataObject = { 'high': data_high, 'low': data_low, 'data': data_arr, };
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(dataObject));
    });
});

module.exports = router;
