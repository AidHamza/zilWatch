# zilWatch.io

[![Node.js CI](https://github.com/zilWatch-io/zilWatch/actions/workflows/node.js.yml/badge.svg)](https://github.com/zilWatch-io/zilWatch/actions/workflows/node.js.yml)

[zilWatch.io](https://zilWatch.io) is a smart dashboard to track your ZILs and ZRC-2 tokens in your wallet, liqudity pool farms, and staked tokens.

## Environment

- Ubuntu 20.04 LTS
- Redis installed and running ([quickstart](https://redis.io/topics/quickstart))
- Node.js v14.x or v16.x installed ([quickstart](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04))

## Development

- Make sure redis is running (e.g., run `redis-server`)
- Run `npm install`
- Run `npm start`
- Visit `localhost:3000`

## Production

- Make sure redis is running (e.g., run `redis-server`)
- Run `npm ci --only=prod`
- Run `npm run uglifyjs`
- Run `npm run uglifycss`
- Run `pm2 start ecocystem.config.js --env production`
- Visit `localhost:3001`

## Testing

- Run `npm ci`
- Run `npm test`
