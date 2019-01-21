const { Suggestion } = require('dialogflow-fulfillment');
const { getMessage } = require('../../language');
const { getParkNames } = require('../../services/parks');

function requirePark(agent, fn) {
  let parkId = agent.parameters.park;

  if (!parkId) {
    const context = agent.context.get('park');
    if (context) {
      parkId = context.parameters && context.parameters.parkId;
    }
  }

  if (parkId) {
    agent.context.set('park', 10, { parkId });
    fn(parkId);
  } else {
    agent.add(getMessage('ask-what-park'));
    agent.add(getParkNames().map(name => new Suggestion(name)));
  }
}

module.exports = {
  requirePark,
};
