const instrumental = require('instrumental-agent');

const { INSTRUMENTAL_API_KEY, NODE_ENV } = process.env;

instrumental.configure({
  apiKey: INSTRUMENTAL_API_KEY,
  enabled: NODE_ENV === 'production',
});

module.exports = instrumental;
