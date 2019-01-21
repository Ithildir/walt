const { WebhookClient } = require('dialogflow-fulfillment');
const basicAuth = require('express-basic-auth');
const intents = require('./intents');

const { DIALOGFLOW_PASSWORD, DIALOGFLOW_USER, NODE_ENV } = process.env;

function buildRoutes(router) {
  let authMiddleware = (req, res, next) => next();

  if (NODE_ENV === 'production') {
    authMiddleware = basicAuth({
      users: { [DIALOGFLOW_USER]: DIALOGFLOW_PASSWORD },
    });
  }

  router.post('/dialogflow', authMiddleware, (request, response) => {
    const agent = new WebhookClient({ request, response });
    return agent.handleRequest(intents);
  });
}

module.exports = buildRoutes;
