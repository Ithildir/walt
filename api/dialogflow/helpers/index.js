const { Suggestion } = require('dialogflow-fulfillment');
const themeparks = require('themeparks');

function requirePark (agent, fn) {
  let parkId = agent.parameters.park;

  if (!parkId) {
    const context = agent.context.get('park');
    if (context) {
      parkId = context.parameters && context.parameters.parkId;
    }
  }

  if (parkId) {
    agent.context.set('park', 10, { parkId });
    return fn(parkId);
  }

  agent.add('What park?');
  agent.add(themeparks.AllParks.map(park => new Suggestion(park.Name)));
}

module.exports = {
  requirePark,
};
