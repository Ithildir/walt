const { WebhookClient } = require('dialogflow-fulfillment');
const intents = require('./intents');
const basicAuth = require('express-basic-auth');

const { DIALOGFLOW_PASSWORD, DIALOGFLOW_USER } = process.env;

function buildRoutes(router) {
  const authMiddleware = basicAuth({
    users: { [DIALOGFLOW_USER]: DIALOGFLOW_PASSWORD },
  });

  router.post('/dialogflow', authMiddleware, (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });
    agent.handleRequest(intents);
  });
}

module.exports = buildRoutes;
