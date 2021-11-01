// Constants.js
// Constants in the server mainly to pass to router to render main page.

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
  'ADS': {
    "ticker": "ADS",
    "name": "ZilAds",
    "address": "zil1cs2au702hcx779yxdg49txjqe7rn989rty3wwy",
    "address_base16": "0xC415dE79eaBe0deF14866A2A559A40CF87329CA3",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1cs2au702hcx779yxdg49txjqe7rn989rty3wwy/logo",
    "decimals": 6,
    "website": "https://zilads.github.io/",
    "telegram": "https://t.me/ziladschat",
  },
  'BLOX': {
    "ticker": "BLOX",
    "name": "Blox Token",
    "address": "zil1gf5vxndx44q6fn025fwdaajnrmgvngdzel0jzp",
    "address_base16": "0x4268C34dA6Ad41a4cDeAa25cdEF6531Ed0c9a1A2",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1gf5vxndx44q6fn025fwdaajnrmgvngdzel0jzp/logo",
    "decimals": 2,
    "website": "https://blox-sdk.com/",
    "telegram": "https://t.me/zilliqaroyale",
  },
  'BOLT': {
    "ticker": "BOLT",
    "name": "Bolt Token",
    "address": "zil1x6z064fkssmef222gkhz3u5fhx57kyssn7vlu0",
    "address_base16": "0x3684Fd5536843794a94a45AE28f289B9a9eB1210",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1x6z064fkssmef222gkhz3u5fhx57kyssn7vlu0/logo",
    "decimals": 18,
    "website": "https://www.bolt.global/",
    "telegram": "https://t.me/BoltGlobal",
  },
  'BUTTON': {
    "ticker": "BUTTON",
    "name": "The Button",
    "address": "zil1epq9dyctg0m5yaxeqv7ph0j532qze28psqfu8h",
    "address_base16": "0xC84056930B43F74274d9033c1bbE548A802CA8E1",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1epq9dyctg0m5yaxeqv7ph0j532qze28psqfu8h/logo",
    "decimals": 12,
    "website": "https://button.claims",
    "telegram": "https://t.me/bridge_button",
  },
  'CARB': {
    "ticker": "CARB",
    "name": "Carbon",
    "address": "zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk",
    "address_base16": "0xbF79E16872fAd92C16810ddD2A7B9B6858C7b756",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk/logo",
    "decimals": 8,
    "website": "https://www.carbontoken.info/",
    "telegram": "https://t.me/carbonholders",
    "whitepaper": "https://github.com/Carbon-Labs/whitepapers",
  },
  'CONSULT': {
    "ticker": "CONSULT",
    "name": "Consult Coin",
    "address": "zil108ex3na3dvwnjq5p4nls4z3gjy8fx66693hf4d",
    "address_base16": "0x79F268CfB16B1d390281AcFf0A8A28910E936b5A",
    "logo_url": "https://meta.viewblock.io/ZIL.zil108ex3na3dvwnjq5p4nls4z3gjy8fx66693hf4d/logo",
    "decimals": 6,
    "website": "https://www.consultcrypto.net/",
    "telegram": "https://t.me/stokenlaunch",
  },
  'DMZ': {
    "ticker": "DMZ",
    "name": "DeMons",
    "address": "zil19lr3vlpm4lufu2q94mmjvdkvmx8wdwajuntzx2",
    "address_base16": "0x2fc7167c3Baff89E2805Aef72636ccD98eE6Bbb2",
    "logo_url": "https://meta.viewblock.io/ZIL.zil19lr3vlpm4lufu2q94mmjvdkvmx8wdwajuntzx2/logo",
    "decimals": 18,
    "website": "https://demons.world/",
    "telegram": "https://t.me/de_monsters",
  },
  'DogZilliqa': {
    "ticker": "DogZilliqa",
    "name": "DogZilliqa",
    "address": "zil17hdu9r4h49d7gyh8s7zkeh3yatqft62uvsu8ep",
    "address_base16": "0xf5DbC28eb7A95bE412E787856cDe24eac095E95c",
    "logo_url": "https://meta.viewblock.io/ZIL.zil17hdu9r4h49d7gyh8s7zkeh3yatqft62uvsu8ep/logo",
    "decimals": 4,
    "website": "https://godzilliqadefi.medium.com/dogzilliqa-token-9141f33beba5",
  },
  'DUCK': {
    "ticker": "DUCK",
    "name": "DuckDuck",
    "address": "zil1c6akv8k6dqaac7ft8ezk5gr2jtxrewfw8hc27d",
    "address_base16": "0xC6Bb661eDA683BdC792b3e456A206a92cc3cB92e",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1c6akv8k6dqaac7ft8ezk5gr2jtxrewfw8hc27d/logo",
    "decimals": 2,
    "website": "https://duck.community/",
    "telegram": "https://t.me/zilduck",
    "whitepaper": "https://duck.community/papers/DUCK%20-%20Widepaper.pdf",
  },
  'ELONS': {
    "ticker": "ELONS",
    "name": "Elons",
    "address": "zil1lq3ghn3yaqk0w7fqtszv53hejunpyfyh3rx9gc",
    "address_base16": "0xF8228Bce24e82CF779205C04Ca46F99726122497",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1lq3ghn3yaqk0w7fqtszv53hejunpyfyh3rx9gc/logo",
    "decimals": 3,
    "website": "https://elons.io/",
    "telegram": "https://t.me/elonstoken",
  },
  'FEES': {
    "ticker": "FEES",
    "name": "Unifees",
    "address": "zil1jy3g5j9w5njqwxuuv3zwkz9syyueelmu7g080v",
    "address_base16": "0x91228A48AEA4E4071B9C6444Eb08B021399CfF7c",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1jy3g5j9w5njqwxuuv3zwkz9syyueelmu7g080v/logo",
    "decimals": 4,
    "website": "https://unifees.io/",
    "telegram": "https://t.me/unifees",
    "whitepaper": "https://unifees.io/Unifees-Whitepaper.pdf",
  },
  'FLAT': {
    "ticker": "FLAT",
    "name": "Flat Lazy Ass Token",
    "address": "zil133vrh59edllqz7guq7htfthjmj7gct5jxqqtl7",
    "address_base16": "0x8C583bD0B96Ffe01791C07Aeb4AeF2DcbC8c2E92",
    "logo_url": "https://meta.viewblock.io/ZIL.zil133vrh59edllqz7guq7htfthjmj7gct5jxqqtl7/logo",
    "decimals": 5,
    "telegram": "https://t.me/Flattoken",
  },
  'FRANC': {
    "ticker": "FRANC",
    "name": "Chocolate Stablecoin",
    "address": "zil1z4hxwnqk9gu6tamcw4umxss9wjpmrkhzdh4n85",
    "address_base16": "0x156e674C162A39a5F7787579B342057483B1Dae2",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1z4hxwnqk9gu6tamcw4umxss9wjpmrkhzdh4n85/logo",
    "decimals": 6,
    "website": "https://mambo.li/stablecoins/franc/",
    "telegram": "https://t.me/MamboToken",
    "whitepaper": "https://mambo.li/downloads/francchocolatestabelcoinwhitepaper.pdf",
  },
  'GARY': {
    "ticker": "GARY",
    "name": "The Gary Token",
    "address": "zil1w5hwupgc9rxyuyd742g2c9annwahugrx80fw9h",
    "address_base16": "0x752eEe051828Cc4e11beaa90AC17B39bBb7E2066",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1w5hwupgc9rxyuyd742g2c9annwahugrx80fw9h/logo",
    "decimals": 4,
    "website": "https://blog.thegarytoken.com/",
    "telegram": "https://t.me/TheGARYToken",
  },
  'gZIL': {
    "ticker": "gZIL",
    "name": "Governance ZIL",
    "address": "zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e",
    "address_base16": "0xa845C1034CD077bD8D32be0447239c7E4be6cb21",
    "logo_url": "https://meta.viewblock.io/ZIL.zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e/logo",
    "decimals": 15,
    "website": "https://zilliqa.com",
  },
  'HODL': {
    "ticker": "HODL",
    "name": "Hodl",
    "address": "zil177u3jh5x4hqual22zy7s2ru3gc2y4yq5wnq2un",
    "address_base16": "0xF7B9195E86Adc1CEfD4a113D050f9146144A9014",
    "logo_url": "https://meta.viewblock.io/ZIL.zil177u3jh5x4hqual22zy7s2ru3gc2y4yq5wnq2un/logo",
    "decimals": 0,
    "telegram": "https://t.me/thehodltoken",
  },
  'LUNR': {
    "ticker": "LUNR",
    "name": "Lunr",
    "address": "zil1xxl6yp2twxvljdnn87g9fk7wykdrcv66xdy4rc",
    "address_base16": "0x31bFa2054B7199F936733f9054DBCE259a3c335a",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1xxl6yp2twxvljdnn87g9fk7wykdrcv66xdy4rc/logo",
    "decimals": 4,
    "website": "https://www.lunrtoken.com/",
    "whitepaper": "https://www.lunrtoken.com/documents/lunr.pdf",
  },
  'MAMBO': {
    "ticker": "MAMBO",
    "name": "Mambo",
    "address": "zil1ykcdhtgyercmv7ndfxt00wm9xzpq4k7hjmfm4e",
    "address_base16": "0x25B0DBAd04c8f1B67A6d4996f7BB6530820ADBd7",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1ykcdhtgyercmv7ndfxt00wm9xzpq4k7hjmfm4e/logo",
    "decimals": 12,
    "website": "https://mambo.li/",
    "telegram": "https://t.me/MamboToken",
  },
  'MESSI': {
    "ticker": "MESSI",
    "name": "Messi Token",
    "address": "zil1qzwxvp3wz3q5ewzg3afesut9pqfax0sjdyna42",
    "address_base16": "0x009C66062e14414Cb8488f539871650813D33E12",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1qzwxvp3wz3q5ewzg3afesut9pqfax0sjdyna42/logo",
    "decimals": 2,
    "website": "https://messitokens.me/",
    "telegram": "https://t.me/TheMessiProject",
    "whitepaper": "https://messitokens.me/assets/docs/Messi%20-%20Whitepaper.pdf",
  },
  'MILKY': {
    "ticker": "MILKY",
    "name": "Milky BabyStable",
    "address": "zil1l8l658hqwz6zmzr7e6emlnfshs9tg53qg3pju9",
    "address_base16": "0xf9fFAA1ee070B42d887eCeB3bFcd30BC0AB45220",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1l8l658hqwz6zmzr7e6emlnfshs9tg53qg3pju9/logo",
    "decimals": 6,
    "website": "https://mambo.li/stablecoins/milky-babystable/",
    "telegram": "https://t.me/MamboToken",
    "whitepaper": "https://mambo.li/downloads/milky-babystable-whitepaper.pdf",
  },
  'NFTDEX': {
    "ticker": "NFTDEX",
    "name": "Zilliqa NFT Index Compound",
    "address": "zil18l7eyut8t4gu68w7mg0ck664ee33mykrycps6l",
    "address_base16": "0x3fFD9271675d51Cd1DdeDA1f8B6b55cE631D92c3",
    "logo_url": "https://meta.viewblock.io/ZIL.zil18l7eyut8t4gu68w7mg0ck664ee33mykrycps6l/logo",
    "decimals": 0,
    "website": "https://zilall.com/",
    "telegram": "https://t.me/zilall_community",
  },
  'OKI': {
    "ticker": "OKI",
    "name": "Okipad",
    "address": "zil12jhxfcsfyaylhrf9gu8lc82ddgvudu4tzvduum",
    "address_base16": "0x54aE64e2092749fb8d25470ffc1d4D6A19c6f2Ab",
    "logo_url": "https://meta.viewblock.io/ZIL.zil12jhxfcsfyaylhrf9gu8lc82ddgvudu4tzvduum/logo",
    "decimals": 5,
    "website": "https://okimoto.io/",
    "telegram": "https://t.me/Okipad",
  },
  'PORT': {
    "ticker": "PORT",
    "name": "PackagePortal",
    "address": "zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2",
    "address_base16": "0x3A683Fdc022b26D755c70E9ed7cFCc446658018b",
    "logo_url": "https://meta.viewblock.io/ZIL.zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2/logo",
    "decimals": 4,
    "website": "https://www.packageportal.com/",
    "telegram": "https://t.me/packageportal",
    "whitepaper": "https://docs.google.com/document/d/1-3qjW4bozTt72CzfGcwDGzcm8---opu0fN1pxs34RyE/edit",
  },
  'PELE': {
    "ticker": "PELE",
    "name": "PELE Network",
    "address": "zil12htx8pdfwk39e47fhd7t3vd3rftyxeuf9px354",
    "address_base16": "0x55d66385a975A25Cd7c9bB7Cb8b1B11A56436789",
    "logo_url": "https://meta.viewblock.io/ZIL.zil12htx8pdfwk39e47fhd7t3vd3rftyxeuf9px354/logo",
    "decimals": 5,
    "website": "https://pele.network/",
    "telegram": "https://t.me/getyousomePELE",
  },
  'PIL': {
    "ticker": "PIL",
    "name": "Pillar Protocol",
    "address": "zil1v5s3f9dds05et8mhtwlzh4l7klyrcnc679y27s",
    "address_base16": "0x65211495AD83E9959f775Bbe2BD7FEb7C83C4f1A",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1v5s3f9dds05et8mhtwlzh4l7klyrcnc679y27s/logo",
    "decimals": 6,
    "website": "https://pillarprotocol.com/",
    "telegram": "https://t.me/PillarProtocol",
  },
  'RECAP': {
    "ticker": "RECAP",
    "name": "Review Capital",
    "address": "zil12drvflckms6874ffuujcdxj75raavl4yfn4ssc",
    "address_base16": "0x5346c4ff16Dc347f5529e725869A5Ea0fbD67EA4",
    "logo_url": "https://meta.viewblock.io/ZIL.zil12drvflckms6874ffuujcdxj75raavl4yfn4ssc/logo",
    "decimals": 12,
    "website": "https://reviewcapital.org/",
    "telegram": "https://t.me/RECAPCommunity",
    "whitepaper": "https://github.com/Review-Capital-Blockchain-Ecosystem/RCIP/blob/master/RECAP-Whitepaper.md",
  },
  'REDC': {
    "ticker": "REDC",
    "name": "RedChillies",
    "address": "zil14jmjrkvfcz2uvj3y69kl6gas34ecuf2j5ggmye",
    "address_base16": "0xaCb721d989c095c64A24d16DfD23b08D738e2552",
    "logo_url": "https://meta.viewblock.io/ZIL.zil14jmjrkvfcz2uvj3y69kl6gas34ecuf2j5ggmye/logo",
    "decimals": 9,
    "website": "https://zilchill.com/",
    "telegram": "https://t.me/redchilliesREDC",
    "whitepaper": "https://github.com/RedChillies-Core/RedChillies-IP/blob/main/Whitepaper.md",
  },
  'SCO': {
    "ticker": "SCO",
    "name": "Score",
    "address": "zil1kwfu3x9n6fsuxc4ynp72uk5rxge25enw7zsf9z",
    "address_base16": "0xb393C898b3d261C362a4987CaE5a833232AA666E",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1kwfu3x9n6fsuxc4ynp72uk5rxge25enw7zsf9z/logo",
    "decimals": 4,
    "website": "https://www.uffsports.com/",
    "telegram": "https://t.me/uffsports",
    "whitepaper": "https://a2410bb1-7d7b-4996-a99b-ef91046e37c6.filesusr.com/ugd/fec035_8655866acaf04bae83f16eb3c8d860f3.pdf",
  },
  'SHARDS': {
    "ticker": "SHARDS",
    "name": "Shards",
    "address": "zil14d6wwelssqumu6w9c6kaucz2r57z34cxuh96lf",
    "address_base16": "0xAb74E767F08039Be69c5C6aDDe604A1D3C28d706",
    "logo_url": "https://meta.viewblock.io/ZIL.zil14d6wwelssqumu6w9c6kaucz2r57z34cxuh96lf/logo",
    "decimals": 12,
    "website": "https://shards.robounicats.com/",
    "telegram": "https://t.me/ruc_shards",
    "whitepaper": "https://shards.robounicats.com/data/shards_whitepaper_0.1.pdf",
  },
  'SHRK': {
    "ticker": "SHRK",
    "name": "Shark",
    "address": "zil17tsmlqgnzlfxsq4evm6n26txm2xlp5hele0kew",
    "address_base16": "0xF2E1bf811317d26802b966F5356966dA8df0d2f9",
    "logo_url": "https://meta.viewblock.io/ZIL.zil17tsmlqgnzlfxsq4evm6n26txm2xlp5hele0kew/logo",
    "decimals": 6,
    "website": "https://bafybeihjzjcpghxq3aa6kupzzq3jcxjslsfxq43k2qkump6q2bu75cd5wy.ipfs.infura-ipfs.io/",
    "telegram": "https://t.me/SHRKFINTECH",
  },
  'SIMP': {
    "ticker": "SIMP",
    "name": "Silly and Foolish Person",
    "address": "zil1aqu3cqd0nrlyvp3hms5gzqvpueedd2e806e9rs",
    "address_base16": "0xE8391C01af98fE460637DC28810181E672d6aB27",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1aqu3cqd0nrlyvp3hms5gzqvpueedd2e806e9rs/logo",
    "decimals": 4,
    "website": "https://zilsimp.com/",
    "telegram": "https://t.me/ZilSIMP",
  },
  'SPW': {
    "ticker": "SPW",
    "name": "Sparda Wallet",
    "address": "zil1pqcev4ykxla0jhy3anx32lnqgv8xncd8q57ql2",
    "address_base16": "0x083196549637fAf95C91EcCD157E60430e69E1A7",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1pqcev4ykxla0jhy3anx32lnqgv8xncd8q57ql2/logo",
    "decimals": 4,
    "website": "https://www.spardawallet.com/",
    "telegram": "https://t.me/SpardaWalletOfficial",
    "whitepaper": "https://drive.google.com/file/d/1nuJGF_OeAEtZDtyQzaBSoKQkClkFObRt/view",
  },
  'SRV': {
    "ticker": "SRV",
    "name": "zilSurvey",
    "address": "zil168qdlq4xsua6ac9hugzntqyasf8gs7aund882v",
    "address_base16": "0xD1c0DF82a6873BAEE0b7E20535809D824E887BBC",
    "logo_url": "https://meta.viewblock.io/ZIL.zil168qdlq4xsua6ac9hugzntqyasf8gs7aund882v/logo",
    "decimals": 2,
    "website": "https://zilsurvey.com/",
    "telegram": "https://t.me/zilSurveyChat",
    "whitepaper": "https://zilsurvey.com/whitepaper.pdf",
  },
  'STREAM': {
    "ticker": "STREAM",
    "name": "ZilStream",
    "address": "zil1504065pp76uuxm7s9m2c4gwszhez8pu3mp6r8c",
    "address_base16": "0xa3eAFd5021F6B9c36fD02Ed58aa1d015F2238791",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1504065pp76uuxm7s9m2c4gwszhez8pu3mp6r8c/logo",
    "decimals": 8,
    "website": "https://zilstream.com/",
    "telegram": "https://t.me/zilstream",
  },
  'UNIDEX': {
    "ticker": "UNIDEX",
    "name": "United DEX Index Compound",
    "address": "zil19cyp6kj7zrz3c2q50ts2nly6hrhrr7vr89g9gf",
    "address_base16": "0x2E081d5a5E10C51c28147Ae0a9fc9aB8Ee31f983",
    "logo_url": "https://meta.viewblock.io/ZIL.zil19cyp6kj7zrz3c2q50ts2nly6hrhrr7vr89g9gf/logo",
    "decimals": 2,
    "website": "https://zilall.com/",
    "telegram": "https://t.me/zilall_community",
  },
  'UNIDEX-V2': {
    "ticker": "UNIDEX-V2",
    "name": "United DEX Index Compound V2",
    "address": "zil1jqkdlkfxdcd2xxjeg7m3xcpyhrgy2yjx2cul6d",
    "address_base16": "0x902cdfD9266e1AA31a5947B7136024B8D0451246",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1jqkdlkfxdcd2xxjeg7m3xcpyhrgy2yjx2cul6d/logo",
    "decimals": 2,
    "website": "https://zilall.com/",
    "telegram": "https://t.me/zilall_community",
  },
  'XCAD': {
    "ticker": "XCAD",
    "name": "XCAD Network",
    "address": "zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y",
    "address_base16": "0x153FeaddC48871108e286de3304B9597c817B456",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y/logo",
    "decimals": 18,
    "website": "https://xcadnetwork.com/",
    "telegram": "https://t.me/xcademy",
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
    "website": "https://www.xfers.com/sg-blog/introducing-xsgd-the-singapore-dollar-backed-and-travel-rule1-compliant-stablecoin",
  },
  'YODA': {
    "ticker": "YODA",
    "name": "Yoda",
    "address": "zil1vdc79fg75sth96xnt6xmq5f55swcd5t6m5zhvn",
    "address_base16": "0x6371E2A51eA41772E8d35E8DB05134a41D86d17a",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1vdc79fg75sth96xnt6xmq5f55swcd5t6m5zhvn/logo",
    "decimals": 5,
    "website": "https://yodamerch.co.za/",
    "telegram": "https://t.me/Yodaco",
    "whitepaper": "https://www.yodaco.co.za/",
  },
  'ZCH': {
    "ticker": "ZCH",
    "name": "Zilchess",
    "address": "zil1s8xzysqcxva2x6aducncv9um3zxr36way3fx9g",
    "address_base16": "0x81cc224018333aA36baDe62786179b888C38e9dd",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1s8xzysqcxva2x6aducncv9um3zxr36way3fx9g/logo",
    "decimals": 6,
    "website": "https://www.zilchess.com/",
    "whitepaper": "https://www.zilchess.com/whitepaper/",
  },
  'zETH': {
    "ticker": "zETH",
    "name": "Bridged ETH",
    "address": "zil19j33tapjje2xzng7svslnsjjjgge930jx0w09v",
    "address_base16": "0x2cA315F4329654614d1E8321f9C252921192c5f2",
    "logo_url": "https://meta.viewblock.io/ZIL.zil19j33tapjje2xzng7svslnsjjjgge930jx0w09v/logo",
    "decimals": 18,
    "website": "https://ethereum.org/",
    "whitepaper": "https://ethereum.org/en/whitepaper/",
  },
  'ZILLEX': {
    "ticker": "ZILLEX",
    "name": "Zilliqa Index Compound",
    "address": "zil1rcp57nc2ue00f2hk7esxaa3j8q93xrexgrmpz7",
    "address_base16": "0x1E034f4f0AE65Ef4AAF6F6606EF632380B130F26",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1rcp57nc2ue00f2hk7esxaa3j8q93xrexgrmpz7/logo",
    "decimals": 12,
    "website": "https://zilall.com/",
    "telegram": "https://t.me/zilall_community",
  },
  'ZLF': {
    "ticker": "ZLF",
    "name": "ZilFlip",
    "address": "zil1r9dcsrya4ynuxnzaznu00e6hh3kpt7vhvzgva0",
    "address_base16": "0x195B880c9DA927C34C5D14f8f7e757BC6c15f997",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1r9dcsrya4ynuxnzaznu00e6hh3kpt7vhvzgva0/logo",
    "decimals": 5,
    "website": "https://zilflip.com/",
    "telegram": "https://t.me/zilFlip",
  },
  'ZLP': {
    "ticker": "ZLP",
    "name": "ZilPay",
    "address": "zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4",
    "address_base16": "0xfbd07e692543d3064B9CF570b27faaBfd7948DA4",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4/logo",
    "decimals": 18,
    "website": "https://zilpay.io/",
    "telegram": "https://t.me/zilpaychat",
    "whitepaper": "https://drive.google.com/file/d/1X-z5AHBp2cOwyXo4ZuVCCBuk7MIX-r6k/view",
  },
  'ZPAINT': {
    "ticker": "ZPAINT",
    "name": "ZilWall Paint",
    "address": "zil1qldr63ds7yuspqcf02263y2lctmtqmr039vrht",
    "address_base16": "0x07dA3D45b0F1390083097a95A8915fC2F6b06c6f",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1qldr63ds7yuspqcf02263y2lctmtqmr039vrht/logo",
    "decimals": 4,
    "website": "https://zilwall.com/",
    "telegram": "https://t.me/zilwall_community",
    "whitepaper": "https://zilwall.com/whitepaper",
  },
  'zUSDT': {
    "ticker": "zUSDT",
    "name": "Bridged USDT",
    "address": "zil1sxx29cshups269ahh5qjffyr58mxjv9ft78jqy",
    "address_base16": "0x818Ca2e217E060aD17B7bD0124a483a1f66930a9",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1sxx29cshups269ahh5qjffyr58mxjv9ft78jqy/logo",
    "decimals": 6,
    "website": "https://tether.to/",
    "whitepaper": "https://tether.to/wp-content/uploads/2016/06/TetherWhitePaper.pdf",
  },
  'ZWALL': {
    "ticker": "ZWALL",
    "name": "ZilWall",
    "address": "zil1xswavlggsqmkd9kddcp0ulceqm9ht36gqkt8ua",
    "address_base16": "0x341dD67D0880376696Cd6E02Fe7f1906cb75C748",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1xswavlggsqmkd9kddcp0ulceqm9ht36gqkt8ua/logo",
    "decimals": 12,
    "website": "https://zilwall.com/",
    "telegram": "https://t.me/zilwall_community",
    "whitepaper": "https://zilwall.com/whitepaper",
  },
  'ZWAP': {
    "ticker": "ZWAP",
    "name": "Zilswap",
    "address": "zil1p5suryq6q647usxczale29cu3336hhp376c627",
    "address_base16": "0x0D21C1901A06aBEE40d8177F95171c8c63AbdC31",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1p5suryq6q647usxczale29cu3336hhp376c627/logo",
    "decimals": 12,
    "website": "https://zilswap.io/",
    "telegram": "https://t.me/zilswapcommunity",
  },
  'zWBTC': {
    "ticker": "zWBTC",
    "name": "Bridged WBTC",
    "address": "zil1wha8mzaxhm22dpm5cav2tepuldnr8kwkvmqtjq",
    "address_base16": "0x75fA7D8BA6BEd4a68774c758A5e43Cfb6633D9d6",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1wha8mzaxhm22dpm5cav2tepuldnr8kwkvmqtjq/logo",
    "decimals": 8,
    "website": "https://bitcoin.org/",
    "whitepaper": "https://bitcoin.org/bitcoin.pdf",
  },
  'ZYRO': {
    "ticker": "ZYRO",
    "name": "zyro",
    "address": "zil1ucvrn22x8366vzpw5t7su6eyml2auczu6wnqqg",
    "address_base16": "0xE61839a9463c75a6082eA2FD0E6B24Dfd5De605C",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1ucvrn22x8366vzpw5t7su6eyml2auczu6wnqqg/logo",
    "decimals": 8,
    "website": "https://zyro.finance/",
  },
}

const nftTokenPropertiesListMap = {
  'BEAR': {
    "ticker": "BEAR",
    "name": "The Bear Market",
    "address": "zil167flx79fykulp57ykmh9gnf3curcnyux6dcj5e",
    "address_base16": "0xD793F378a925b9f0d3C4b6Ee544D31C707899386",
    "logo_url": "https://meta.viewblock.io/ZIL.zil167flx79fykulp57ykmh9gnf3curcnyux6dcj5e/logo",
    "image_dict_path" : ["image"],
    "website": "https://thebear.market",
  },
  'DZT': {
    "ticker": "DZT",
    "name": "DragonZIL",
    "address": "zil1knvrhm9e2rqfdvqp50gu02a3pat34e6lst9d36",
    "address_base16": "0xb4D83BECB950c096B001a3D1c7aBb10F571ae75f",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1knvrhm9e2rqfdvqp50gu02a3pat34e6lst9d36/logo",
    "image_dict_path" : [],
    "website": "https://dragonzil.xyz",
    "website_nft_attributes_prefix" : "https://dragonzil.xyz/dragon", // e.g., https://dragonzil.xyz/dragon/4128
  },
  'NFD': {
    "ticker": "NFD",
    "name": "Non Fungible Ducks",
    "address": "zil1qmmsv4w54fvpnec32cltywpk24zf7f8fftmfmp",
    "address_base16": "0x06f70655d4AA5819E711563EB2383655449f24E9",
    "logo_url": "https://meta.viewblock.io/ZIL.zil1qmmsv4w54fvpnec32cltywpk24zf7f8fftmfmp/logo",
    "image_dict_path" : [],
    "website": "https://app.duck.community",
    "image_url_replace_from" : "https://gateway.pinata.cloud/ipfs",
    "image_url_replace_to" : "https://ipfs.io/ipfs",
  },
  'UCUTE': {
    "ticker": "UCUTE",
    "name": "Unicutes NFT",
    "address": "zil1afr40j968jqx8puvxhgtp6c9c77w3y4p49a0hw",
    "address_base16": "0xEA4757C8Ba3C8063878C35D0B0eB05C7bCe892a1",
    "logo_url": "https://unicutes.app/favicon.ico",
    "image_dict_path" : [],
    "website": "https://unicutes.app",
    "website_nft_attributes_prefix": "https://unicutes.app/explore/unicutes", // e.g., https://unicutes.app/explore/unicutes/211
  },
}

// IF changed, also change in zilWatch-backend/core/constants.py
const emptyZrcTokensSupply = {};
for (let key in zrcTokenPropertiesListMap) {
  emptyZrcTokensSupply[key] = '0';
}

module.exports = {
  coinMap: coinMap,
  currencyMap: currencyMap,
  ssnListMap: ssnListMap,
  zrcTokenPropertiesListMap: zrcTokenPropertiesListMap,
  nftTokenPropertiesListMap: nftTokenPropertiesListMap,
  emptyZrcTokensSupply: emptyZrcTokensSupply,
};