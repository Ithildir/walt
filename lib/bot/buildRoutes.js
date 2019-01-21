const { WebhookClient } = require('dialogflow-fulfillment');
// const basicAuth = require('express-basic-auth');
const titleCase = require('title-case');
const intents = require('./intents');

// const { DIALOGFLOW_USER, DIALOGFLOW_PASSWORD, NODE_ENV } = process.env;

function buildRoutes(router) {
  // let authMiddleware;

  // if (NODE_ENV === 'production') {
  //   authMiddleware = basicAuth({
  //     users: {
  //       [DIALOGFLOW_USER]: DIALOGFLOW_PASSWORD,
  //     },
  //   });
  // } else {
  //   authMiddleware = () => {};
  // }

  router.post('/dialogflow', (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });

    const intentMap = new Map();

    Object.keys(intents).forEach(name => {
      intentMap.set(titleCase(name), intents[name]);
    });

    agent.handleRequest(intentMap);
  });
}

module.exports = buildRoutes;
