const { WebhookClient } = require('dialogflow-fulfillment');
const express = require('express');
const basicAuth = require('express-basic-auth');
const intents = require('./intents');
const instrumentation = require('../instrumentation');

const { NOW_REGION, PASSWORD, USERNAME } = process.env;

const app = express();

if (NOW_REGION !== 'dev1') {
  app.use(basicAuth({ users: { [USERNAME]: PASSWORD } }));
}
app.use(express.json());

app.all('*', async (request, response) => {
  const startTime = Date.now();
  const agent = new WebhookClient({ request, response });

  try {
    await agent.handleRequest(intents);
  } finally {
    instrumentation.gauge('app.web.request', Date.now() - startTime);
  }
});

module.exports = app;
