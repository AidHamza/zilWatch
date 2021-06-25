# zilWatch.io

[![Node.js CI](https://github.com/zilWatch-io/zilWatch/actions/workflows/node.js.yml/badge.svg)](https://github.com/zilWatch-io/zilWatch/actions/workflows/node.js.yml)

### Development

- Run `npm install`
- Run `npm start`
- It will serve `localhost:3000`

### Production

- Run `npm ci --only=prod`
- Run `npm run uglifyjs`
- Run `npm run uglifycss`
- Run `pm2 start ecocystem.config.js --env production`
- It will serve `localhost:3001`

### Testing

- Run `npm install`
- Run `npm test`
