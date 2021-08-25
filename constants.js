// Constants.js
// Constants in the server mainly to pass to router to render main page.

const title = 'zilWatch';
const description = 'View your Zilliqa (ZIL) wallet balances and current ZIL and ZRC-2 prices today in an all-in-one smart dashboard.';

const coinMap = {
  "BTC": {
    name: "Bitcoin",
    ticker: "BTC",
    coingecko_id: "bitcoin",
    logo_url: "https://meta.viewblock.io/BTC/logo",
  },
  "ETH": {
    name: "Ethereum",
    ticker: "ETH",
    coingecko_id: "ethereum",
    logo_url: "https://meta.viewblock.io/ETH/logo",
  },
  "BNB": {
    name: "Binance Coin",
    ticker: "BNB",
    coingecko_id: "binancecoin",
    logo_url: "https://meta.viewblock.io/BNB/logo",
  },
  "ZIL": {
    name: "Zilliqa",
    ticker: "ZIL",
    coingecko_id: "zilliqa",
    logo_url: "https://meta.viewblock.io/ZIL/logo",
  },
}

// IF changed, also change in zilWatch-backend/core/crawl_coingecko.py
const currencyMap = {
  "usd": "$",
  "aed": "AED",
  "ars": "$",
  "aud": "$",
  "bdt": "৳",
  "bhd": "BD",
  "bmd": "$",
  "brl": "R$",
  "cad": "$",
  "chf": "CHF",
  "clp": "$",
  "cny": "¥",
  "czk": "Kč",
  "dkk": "kr",
  "eur": "€",
  "gbp": "£",
  "hkd": "$",
  "huf": "ft",
  "idr": "Rp",
  "ils": "₪",
  "inr": "₹",
  "jpy": "¥",
  "krw": "₩",
  "kwd": "KD",
  "lkr": "Rs",
  "mmk": "K",
  "mxn": "$",
  "myr": "RM",
  "ngn": "₦",
  "nok": "kr",
  "nzd": "$",
  "php": "₱",
  "pkr": "Rs",
  "pln": "zł",
  "rub": "₽",
  "sar": "SAR",
  "sek": "kr",
  "sgd": "$",
  "thb": "THB",
  "try": "₺",
  "twd": "$",
  "uah": "₴",
  "vef": "B$",
  "vnd": "₫",
  "zar": "R",
}

// Obtained from getSmartContractSubState(ZilSeedNodeStakingImplementationAddress, "ssnlist");
const ssnListMap = {
  "0x122219cceab410901e96c3a0e55e46231480341b": {
    "argtypes": [],
    "arguments": [{
      "argtypes": [],
      "arguments": [],
      "constructor": "True"
    }, "144256828594494601381", "904485811906975130", "Zilliqa", "https://staking.seed.zilliqa.com", "https://stakingseed-api.seed.zilliqa.com", "780606043502001252", "120000000", "1172199313531192108", "0x122219cceab410901e96c3a0e55e46231480341b"],
    "constructor": "Ssn"
  },
  "0x2afe9e18edd39d927d0ffff8990612fc4afa2295": {
    "argtypes": [],
    "arguments": [{
      "argtypes": [],
      "arguments": [],
      "constructor": "True"
    }, "95909290512582916909", "374331545339346023", "Ezil.me", "https://zil-staking.ezil.me/raw", "https://zil-staking.ezil.me/api", "38571422082543753", "20000000", "82409292339579295", "0x2afe9e18edd39d927d0ffff8990612fc4afa2295"],
    "constructor": "Ssn"
  },
  "0x3ee34d308f962d17774a591f32cd1214e8bc470d": {
    "argtypes": [],
    "arguments": [{
      "argtypes": [],
      "arguments": [],
      "constructor": "True"
    }, "69642079657659784741", "293275158563898063", "Shardpool.io", "https://seed-zil.shardpool.io/raw", "https://seed-zil.shardpool.io", "145622152300000000", "20000000", "2261254967945755", "0x3ee34d308f962d17774a591f32cd1214e8bc470d"],
    "constructor": "Ssn"
  },
  "0x635eff625a147c7ca0397445eee436129ee6ca0b": {
    "argtypes": [],
    "arguments": [{
      "argtypes": [],
      "arguments": [],
      "constructor": "True"
    }, "1203240895980911472789", "4053551777461587750", "Moonlet.io", "https://ssn-zilliqa.moonlet.network/raw", "https://ssn-zilliqa.moonlet.network/api", "1627631292141825652", "50000000", "274305990516036756", "0x635eff625a147c7ca0397445eee436129ee6ca0b"],
    "constructor": "Ssn"
  },
  "0x657077b8dc9a60300fc805d559c0a5ef9bdd94a5": {
    "argtypes": [],
    "arguments": [{
      "argtypes": [],
      "arguments": [],
      "constructor": "False"
    }, "118937253007252384", "0", "Everstake.one", "https://zilapi.everstake.one/TrdFrsHsHsYdOpfgNdTsIdxtJldtMfLd", "https://zilapi.everstake.one/status/TrdFrsHsHsYdOpfgNdTsIdxtJldtMfLd", "0", "50000000", "0", "0x657077b8dc9a60300fc805d559c0a5ef9bdd94a5"],
    "constructor": "Ssn"
  },
  "0x82b82c65213e0b2b206492d3d8a2a679e7fe52e0": {
    "argtypes": [],
    "arguments": [{
      "argtypes": [],
      "arguments": [],
      "constructor": "True"
    }, "452697276249153636988", "1976913795785643616", "ViewBlock", "https://ssn-raw-mainnet.viewblock.io", "https://ssn-api-mainnet.viewblock.io", "244851152839322654", "40000000", "45589671828531352", "0x413eef8e35281e8fb17bc1e289de956ccc6afea6"],
    "constructor": "Ssn"
  },
  "0x90d3dbd71c54c38341a6f5682c607e8a17023c28": {
    "argtypes": [],
    "arguments": [{
      "argtypes": [],
      "arguments": [],
      "constructor": "True"
    }, "1213436724691050297024", "9687658957345375027", "AtomicWallet", "https://zilliqa.atomicwallet.io/raw", "https://zilliqa.atomicwallet.io/api", "3800419948862346269", "50000000", "249637920981845890", "0x90d3dbd71c54c38341a6f5682c607e8a17023c28"],
    "constructor": "Ssn"
  },
  "0x9fb9e7ef9d0dd545c2f4a29a5bb97cc8ac15d2eb": {
    "argtypes": [],
    "arguments": [{
      "argtypes": [],
      "arguments": [],
      "constructor": "True"
    }, "656955853232734662298", "5058885071517201849", "CEX.IO", "https://ssn-zilliqa.cex.io/raw", "https://ssn-zilliqa.cex.io/api", "2509293752767796642", "10000000", "103270386353373052", "0x9fb9e7ef9d0dd545c2f4a29a5bb97cc8ac15d2eb"],
    "constructor": "Ssn"
  },
  "0xb83fc2c72c44b6b869c64384375c979dc3f7cf05": {
    "argtypes": [],
    "arguments": [{
      "argtypes": [],
      "arguments": [],
      "constructor": "True"
    }, "595624166093549865952", "2724036177435605817", "Zillacracy", "https://ssn.zillacracy.com/staking", "https://ssn.zillacracy.com/api", "275540845401748029", "50000000", "460798646137048313", "0x44ba862ba886eae28357d67b8f0aa6e9442e8c14"],
    "constructor": "Ssn"
  },
  "0xbf4e5001339dec3cda012f471f4f2d9e8bed2f5b": {
    "argtypes": [],
    "arguments": [{
      "argtypes": [],
      "arguments": [],
      "constructor": "True"
    }, "253233411960494256093", "1909419426225375764", "Zillet", "https://ssn.zillet.io/staking", "https://ssn.zillet.io", "706424445361929028", "50000000", "102007647933810586", "0xbf4e5001339dec3cda012f471f4f2d9e8bed2f5b"],
    "constructor": "Ssn"
  },
  "0xc3ed69338765424f4771dd636a5d3bfa0a776a35": {
    "argtypes": [],
    "arguments": [{
      "argtypes": [],
      "arguments": [],
      "constructor": "False"
    }, "475866700717910770", "0", "Staked", "https://zilliqa-staking.staked.cloud", "https://zilliqa-api.staked.cloud", "0", "100000000", "0", "0xc3ed69338765424f4771dd636a5d3bfa0a776a35"],
    "constructor": "Ssn"
  },
  "0xd8de27a85c0dbc43bdd9a525e016670732db899f": {
    "argtypes": [],
    "arguments": [{
      "argtypes": [],
      "arguments": [],
      "constructor": "True"
    }, "81277449135033079560", "253915398143985005", "KuCoin", "https://staking-zil.kucoin.com", "https://staking-zil.kucoin.com/api", "11002727000000000", "50000000", "244956389423096166", "0xd8de27a85c0dbc43bdd9a525e016670732db899f"],
    "constructor": "Ssn"
  },
}

// IF changed, also change in zilWatch-backend/core/constants.py
const zrcTokenPropertiesListMap = {
  'BOLT': {
    "ticker": "BOLT",
    "name": "Bolt Token",
    "address": "zil1x6z064fkssmef222gkhz3u5fhx57kyssn7vlu0",
    "address_base16": "0x3684Fd5536843794a94a45AE28f289B9a9eB1210",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1x6z064fkssmef222gkhz3u5fhx57kyssn7vlu0/logo",
    "decimals": 18,
  },
  'BLOX': {
    "ticker": "BLOX",
    "name": "Blox Token",
    "address": "zil1gf5vxndx44q6fn025fwdaajnrmgvngdzel0jzp",
    "address_base16": "0x4268C34dA6Ad41a4cDeAa25cdEF6531Ed0c9a1A2",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1gf5vxndx44q6fn025fwdaajnrmgvngdzel0jzp/logo",
    "decimals": 2,
  },
  'CARB': {
    "ticker": "CARB",
    "name": "Carbon",
    "address": "zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk",
    "address_base16": "0xbF79E16872fAd92C16810ddD2A7B9B6858C7b756",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk/logo",
    "decimals": 8,
  },
  'DogZilliqa': {
    "ticker": "DogZilliqa",
    "name": "DogZilliqa",
    "address": "zil17hdu9r4h49d7gyh8s7zkeh3yatqft62uvsu8ep",
    "address_base16": "0xf5DbC28eb7A95bE412E787856cDe24eac095E95c",
    "logo_url": "https://meta.viewblock.io/ZIL.zil17hdu9r4h49d7gyh8s7zkeh3yatqft62uvsu8ep/logo",
    "decimals": 4,
  },
  'DUCK': {
    "ticker": "DUCK",
    "name": "DuckDuck",
    "address": "zil1c6akv8k6dqaac7ft8ezk5gr2jtxrewfw8hc27d",
    "address_base16": "0xC6Bb661eDA683BdC792b3e456A206a92cc3cB92e",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1c6akv8k6dqaac7ft8ezk5gr2jtxrewfw8hc27d/logo",
    "decimals": 2,
  },
  'ELONS': {
    "ticker": "ELONS",
    "name": "Elons",
    "address": "zil1lq3ghn3yaqk0w7fqtszv53hejunpyfyh3rx9gc",
    "address_base16": "0xF8228Bce24e82CF779205C04Ca46F99726122497",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1lq3ghn3yaqk0w7fqtszv53hejunpyfyh3rx9gc/logo",
    "decimals": 3,
  },
  'FLAT': {
    "ticker": "FLAT",
    "name": "Flat Lazy Ass Token",
    "address": "zil133vrh59edllqz7guq7htfthjmj7gct5jxqqtl7",
    "address_base16": "0x8C583bD0B96Ffe01791C07Aeb4AeF2DcbC8c2E92",
    "logo_url": "https://meta.viewblock.io/ZIL.zil133vrh59edllqz7guq7htfthjmj7gct5jxqqtl7/logo",
    "decimals": 5,
  },
  'GARY': {
    "ticker": "GARY",
    "name": "The Gary Token",
    "address": "zil1w5hwupgc9rxyuyd742g2c9annwahugrx80fw9h",
    "address_base16": "0x752eEe051828Cc4e11beaa90AC17B39bBb7E2066",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1w5hwupgc9rxyuyd742g2c9annwahugrx80fw9h/logo",
    "decimals": 4,
  },
  'gZIL': {
    "ticker": "gZIL",
    "name": "Governance ZIL",
    "address": "zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e",
    "address_base16": "0xa845C1034CD077bD8D32be0447239c7E4be6cb21",
    "logo_url": "https://meta.viewblock.io/ZIL.zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e/logo",
    "decimals": 15
  },
  'MAMBO': {
    "ticker": "MAMBO",
    "name": "Mambo",
    "address": "zil1ykcdhtgyercmv7ndfxt00wm9xzpq4k7hjmfm4e",
    "address_base16": "0x25B0DBAd04c8f1B67A6d4996f7BB6530820ADBd7",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1ykcdhtgyercmv7ndfxt00wm9xzpq4k7hjmfm4e/logo",
    "decimals": 12,
  },
  'MESSI': {
    "ticker": "MESSI",
    "name": "Messi Token",
    "address": "zil1qzwxvp3wz3q5ewzg3afesut9pqfax0sjdyna42",
    "address_base16": "0x009C66062e14414Cb8488f539871650813D33E12",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1qzwxvp3wz3q5ewzg3afesut9pqfax0sjdyna42/logo",
    "decimals": 2,
  },
  'PORT': {
    "ticker": "PORT",
    "name": "PackagePortal",
    "address": "zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2",
    "address_base16": "0x3A683Fdc022b26D755c70E9ed7cFCc446658018b",
    "logo_url": "https://meta.viewblock.io/ZIL.zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2/logo",
    "decimals": 4,
  },
  'RECAP': {
    "ticker": "RECAP",
    "name": "Review Capital",
    "address": "zil12drvflckms6874ffuujcdxj75raavl4yfn4ssc",
    "address_base16": "0x5346c4ff16Dc347f5529e725869A5Ea0fbD67EA4",
    "logo_url": "https://meta.viewblock.io/ZIL.zil12drvflckms6874ffuujcdxj75raavl4yfn4ssc/logo",
    "decimals": 12,
  },
  'REDC': {
    "ticker": "REDC",
    "name": "RedChillies",
    "address": "zil14jmjrkvfcz2uvj3y69kl6gas34ecuf2j5ggmye",
    "address_base16": "0xaCb721d989c095c64A24d16DfD23b08D738e2552",
    "logo_url": "https://meta.viewblock.io/ZIL.zil14jmjrkvfcz2uvj3y69kl6gas34ecuf2j5ggmye/logo",
    "decimals": 9,
  },
  'SCO': {
    "ticker": "SCO",
    "name": "Score",
    "address": "zil1kwfu3x9n6fsuxc4ynp72uk5rxge25enw7zsf9z",
    "address_base16": "0xb393C898b3d261C362a4987CaE5a833232AA666E",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1kwfu3x9n6fsuxc4ynp72uk5rxge25enw7zsf9z/logo",
    "decimals": 4,
  },
  'SHARDS': {
    "ticker": "SHARDS",
    "name": "Shards",
    "address": "zil14d6wwelssqumu6w9c6kaucz2r57z34cxuh96lf",
    "address_base16": "0xAb74E767F08039Be69c5C6aDDe604A1D3C28d706",
    "logo_url": "https://meta.viewblock.io/ZIL.zil14d6wwelssqumu6w9c6kaucz2r57z34cxuh96lf/logo",
    "decimals": 12,
  },
  'SHRK': {
    "ticker": "SHRK",
    "name": "Shark",
    "address": "zil17tsmlqgnzlfxsq4evm6n26txm2xlp5hele0kew",
    "address_base16": "0xF2E1bf811317d26802b966F5356966dA8df0d2f9",
    "logo_url": "https://meta.viewblock.io/ZIL.zil17tsmlqgnzlfxsq4evm6n26txm2xlp5hele0kew/logo",
    "decimals": 6,
  },
  'SIMP': {
    "ticker": "SIMP",
    "name": "Silly and Foolish Person",
    "address": "zil1aqu3cqd0nrlyvp3hms5gzqvpueedd2e806e9rs",
    "address_base16": "0xE8391C01af98fE460637DC28810181E672d6aB27",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1aqu3cqd0nrlyvp3hms5gzqvpueedd2e806e9rs/logo",
    "decimals": 4,
  },
  'SPW': {
    "ticker": "SPW",
    "name": "Sparda Wallet",
    "address": "zil1pqcev4ykxla0jhy3anx32lnqgv8xncd8q57ql2",
    "address_base16": "0x083196549637fAf95C91EcCD157E60430e69E1A7",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1pqcev4ykxla0jhy3anx32lnqgv8xncd8q57ql2/logo",
    "decimals": 4,
  },
  'SRV': {
    "ticker": "SRV",
    "name": "zilSurvey",
    "address": "zil168qdlq4xsua6ac9hugzntqyasf8gs7aund882v",
    "address_base16": "0xD1c0DF82a6873BAEE0b7E20535809D824E887BBC",
    "logo_url": "https://meta.viewblock.io/ZIL.zil168qdlq4xsua6ac9hugzntqyasf8gs7aund882v/logo",
    "decimals": 2,
  },
  'STREAM': {
    "ticker": "STREAM",
    "name": "ZilStream",
    "address": "zil1504065pp76uuxm7s9m2c4gwszhez8pu3mp6r8c",
    "address_base16": "0xa3eAFd5021F6B9c36fD02Ed58aa1d015F2238791",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1504065pp76uuxm7s9m2c4gwszhez8pu3mp6r8c/logo",
    "decimals": 8,
  },
  'XCAD': {
    "ticker": "XCAD",
    "name": "XCAD Network",
    "address": "zil1h63h5rlg7avatnlzhfnfzwn8vfspwkapzdy2aw",
    "address_base16": "0xBeA37A0Fe8F759D5CFE2Ba66913a676260175Ba1",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1h63h5rlg7avatnlzhfnfzwn8vfspwkapzdy2aw/logo",
    "decimals": 6,
  },
  'XPORT': {
    "ticker": "XPORT",
    "name": "PackagePortal",
    "address": "zil1hpwshtxspjakjh5sn7vn4e7pp4gaqkefup24h2",
    "address_base16": "0xB85D0BAcd00Cbb695e909f993aE7c10D51D05B29",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1hpwshtxspjakjh5sn7vn4e7pp4gaqkefup24h2/logo",
    "decimals": 4,
  },
  'XSGD': {
    "ticker": "XSGD",
    "name": "SGD Stablecoin",
    "address": "zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t",
    "address_base16": "0x173Ca6770Aa56EB00511Dac8e6E13B3D7f16a5a5",
    "logo_url": "https://meta.viewblock.io/ZIL.zil180v66mlw007ltdv8tq5t240y7upwgf7djklmwh/logo",
    "decimals": 6,
  },
  'ZCH': {
    "ticker": "ZCH",
    "name": "Zilchess",
    "address": "zil1s8xzysqcxva2x6aducncv9um3zxr36way3fx9g",
    "address_base16": "0x81cc224018333aA36baDe62786179b888C38e9dd",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1s8xzysqcxva2x6aducncv9um3zxr36way3fx9g/logo",
    "decimals": 6,
  },
  'ZLF': {
    "ticker": "ZLF",
    "name": "ZilFlip",
    "address": "zil1r9dcsrya4ynuxnzaznu00e6hh3kpt7vhvzgva0",
    "address_base16": "0x195B880c9DA927C34C5D14f8f7e757BC6c15f997",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1r9dcsrya4ynuxnzaznu00e6hh3kpt7vhvzgva0/logo",
    "decimals": 5,
  },
  'ZLP': {
    "ticker": "ZLP",
    "name": "ZilPay",
    "address": "zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4",
    "address_base16": "0xfbd07e692543d3064B9CF570b27faaBfd7948DA4",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4/logo",
    "decimals": 18,
  },
  'ZPAINT': {
    "ticker": "ZPAINT",
    "name": "ZilWall Paint",
    "address": "zil1qldr63ds7yuspqcf02263y2lctmtqmr039vrht",
    "address_base16": "0x07dA3D45b0F1390083097a95A8915fC2F6b06c6f",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1qldr63ds7yuspqcf02263y2lctmtqmr039vrht/logo",
    "decimals": 4,
  },
  'ZWALL': {
    "ticker": "ZWALL",
    "name": "ZilWall",
    "address": "zil1xswavlggsqmkd9kddcp0ulceqm9ht36gqkt8ua",
    "address_base16": "0x341dD67D0880376696Cd6E02Fe7f1906cb75C748",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1xswavlggsqmkd9kddcp0ulceqm9ht36gqkt8ua/logo",
    "decimals": 12,
  },
  'ZWAP': {
    "ticker": "ZWAP",
    "name": "Zilswap",
    "address": "zil1p5suryq6q647usxczale29cu3336hhp376c627",
    "address_base16": "0x0D21C1901A06aBEE40d8177F95171c8c63AbdC31",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1p5suryq6q647usxczale29cu3336hhp376c627/logo",
    "decimals": 12,
  },
  'ZYRO': {
    "ticker": "ZYRO",
    "name": "zyro",
    "address": "zil1ucvrn22x8366vzpw5t7su6eyml2auczu6wnqqg",
    "address_base16": "0xE61839a9463c75a6082eA2FD0E6B24Dfd5De605C",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1ucvrn22x8366vzpw5t7su6eyml2auczu6wnqqg/logo",
    "decimals": 8,
  },
}

// IF changed, also change in zilWatch-backend/core/constants.py
const emptyZrcTokensSupply = {
  'BOLT': '0',
  'BLOX': '0',
  'CARB': '0',
  'DogZilliqa': '0',
  'DUCK': '0',
  'ELONS': '0',
  'FLAT': '0',
  'GARY': '0',
  'gZIL': '0',
  'MAMBO': '0',
  'MESSI': '0',
  'PORT': '0',
  'RECAP': '0',
  'REDC': '0',
  'SCO': '0',
  'SHARDS': '0',
  'SHRK': '0',
  'SIMP': '0',
  'SPW': '0',
  'SRV': '0',
  'STREAM': '0',
  'XCAD': '0',
  'XPORT': '0',
  'XSGD': '0',
  'ZCH': '0',
  'ZLF': '0',
  'ZLP': '0',
  'ZPAINT': '0',
  'ZWALL': '0',
  'ZWAP': '0',
  'ZYRO': '0',
}

module.exports = {
  title: title,
  description: description,
  coinMap: coinMap,
  currencyMap: currencyMap,
  ssnListMap: ssnListMap,
  zrcTokenPropertiesListMap: zrcTokenPropertiesListMap,
  emptyZrcTokensSupply: emptyZrcTokensSupply,
};