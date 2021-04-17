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
    "name": "Proof Of Receipt Token",
    "address": "zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2",
    "logo_url": "https://meta.viewblock.io/ZIL.zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2/logo",
    "decimals": 4,
  },
  'ZWAP': {
    "ticker": "ZWAP",
    "name": "Zilswap",
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
    "name": "ZilPay wallet",
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
    "name": "CARBON",
    "address": "zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk/logo",
    "decimals": 8,
  },
  'SRV': {
    "ticker": "SRV",
    "name": "zilSurvey.com",
    "address": "zil168qdlq4xsua6ac9hugzntqyasf8gs7aund882v",
    "logo_url": "https://meta.viewblock.io/ZIL.zil168qdlq4xsua6ac9hugzntqyasf8gs7aund882v/logo",
    "decimals": 2,
  },
  'DUCK': {
    "ticker": "DUCK",
    "name": "DuckDuck",
    "address": "zil1c6akv8k6dqaac7ft8ezk5gr2jtxrewfw8hc27d",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1c6akv8k6dqaac7ft8ezk5gr2jtxrewfw8hc27d/logo",
    "decimals": 2,
  },
  'ELONS': {
    "ticker": "ELONS",
    "name": "Elons",
    "address": "zil1lq3ghn3yaqk0w7fqtszv53hejunpyfyh3rx9gc",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1lq3ghn3yaqk0w7fqtszv53hejunpyfyh3rx9gc/logo",
    "decimals": 3,
  },
  'ZCH': {
    "ticker": "ZCH",
    "name": "ZILCHESS",
    "address": "zil1s8xzysqcxva2x6aducncv9um3zxr36way3fx9g",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1s8xzysqcxva2x6aducncv9um3zxr36way3fx9g/logo",
    "decimals": 6,
  },
  'BOLT': {
    "ticker": "BOLT",
    "name": "Bolt Token",
    "address": "zil1x6z064fkssmef222gkhz3u5fhx57kyssn7vlu0",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1x6z064fkssmef222gkhz3u5fhx57kyssn7vlu0/logo",
    "decimals": 18,
  },
  'ZYRO': {
    "ticker": "ZYRO",
    "name": "zyro",
    "address": "zil1ucvrn22x8366vzpw5t7su6eyml2auczu6wnqqg",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1ucvrn22x8366vzpw5t7su6eyml2auczu6wnqqg/logo",
    "decimals": 8,
  },
  'ZLF': {
    "ticker": "ZLF",
    "name": "ZilFlip.com Token",
    "address": "zil1r9dcsrya4ynuxnzaznu00e6hh3kpt7vhvzgva0",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1r9dcsrya4ynuxnzaznu00e6hh3kpt7vhvzgva0/logo",
    "decimals": 5,
  },
  'BARTER': {
    "ticker": "BARTER",
    "name": "CryptoBarter.group",
    "address": "zil17zvlqn2xamqpumlm2pgul9nezzd3ydmrufxnct",
    "logo_url": "https://meta.viewblock.io/ZIL.zil17zvlqn2xamqpumlm2pgul9nezzd3ydmrufxnct/logo",
    "decimals": 2,
  },
  'GARY': {
    "ticker": "GARY",
    "name": "The GARY Token",
    "address": "zil1w5hwupgc9rxyuyd742g2c9annwahugrx80fw9h",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1w5hwupgc9rxyuyd742g2c9annwahugrx80fw9h/logo",
    "decimals": 4,
  },
  'RECAP': {
    "ticker": "RECAP",
    "name": "Review Capital",
    "address": "zil12drvflckms6874ffuujcdxj75raavl4yfn4ssc",
    "logo_url": "https://meta.viewblock.io/ZIL.zil12drvflckms6874ffuujcdxj75raavl4yfn4ssc/logo",
    "decimals": 12,
  },
  'AXT': {
    "ticker": "AXT",
    "name": "AXtoken",
    "address": "zil1rk9vdfu2xsp7y4h24qg78n6ss23mxxge5slsv2",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1rk9vdfu2xsp7y4h24qg78n6ss23mxxge5slsv2/logo",
    "decimals": 6,
  },
  'GOD': {
    "ticker": "GOD",
    "name": "Gods of Hinduism",
    "address": "zil105lwcl5ckrrl2ljhq8v2360vhy30wy85wgvmym",
    "logo_url": "https://meta.viewblock.io/ZIL.zil105lwcl5ckrrl2ljhq8v2360vhy30wy85wgvmym/logo",
    "decimals": 0,
  },
  'SHRK': {
    "ticker": "SHRK",
    "name": "SHARK",
    "address": "zil17tsmlqgnzlfxsq4evm6n26txm2xlp5hele0kew",
    "logo_url": "https://meta.viewblock.io/ZIL.zil17tsmlqgnzlfxsq4evm6n26txm2xlp5hele0kew/logo",
    "decimals": 6,
  },
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'zilWatch', zrcTokenPropertiesMap: zrcTokenPropertiesMap });
});

module.exports = router;
