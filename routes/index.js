var express = require('express');
var router = express.Router();

const zrcTokenPropertiesMap = {
  'gZIL': {
    "ticker": "gZIL",
    "name": "Governance ZIL",
    "address": "zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e",
    "logo_url": "https://meta.viewblock.io/ZIL.zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e/logo",
    "decimals": 15
  },
  'PORT': {
    "ticker": "PORT",
    "name": "Package Portal",
    "address": "zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2",
    "logo_url": "https://meta.viewblock.io/ZIL.zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2/logo",
    "decimals": 4,
  },
  'ZWAP': {
    "ticker": "ZWAP",
    "name": "ZilSwap",
    "address": "zil1p5suryq6q647usxczale29cu3336hhp376c627",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1p5suryq6q647usxczale29cu3336hhp376c627/logo",
    "decimals": 12,
  },
  'XSGD': {
    "ticker": "XSGD",
    "name": "XSGD",
    "address": "zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t",
    "logo_url": "https://meta.viewblock.io/ZIL.zil180v66mlw007ltdv8tq5t240y7upwgf7djklmwh/logo",
    "decimals": 6,
  },
  'ZLP': {
    "ticker": "ZLP",
    "name": "ZilPay",
    "address": "zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4/logo",
    "decimals": 18,
  },
  'REDC': {
    "ticker": "REDC",
    "name": "RedChillies",
    "address": "zil14jmjrkvfcz2uvj3y69kl6gas34ecuf2j5ggmye",
    "logo_url": "https://meta.viewblock.io/ZIL.zil14jmjrkvfcz2uvj3y69kl6gas34ecuf2j5ggmye/logo",
    "decimals": 9,
  },
  'CARB': {
    "ticker": "CARB",
    "name": "Carbon",
    "address": "zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk/logo",
    "decimals": 8,
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'zilWatch - Watch em\' all!', zrcTokenPropertiesMap: zrcTokenPropertiesMap });
});

module.exports = router;
