const instrumental = require('instrumental-agent');

const { INSTRUMENTAL_API_KEY, NOW_REGION } = process.env;

instrumental.configure({
  apiKey: INSTRUMENTAL_API_KEY,
  enabled: (NOW_REGION !== 'dev1')
});

module.exports = instrumental;
