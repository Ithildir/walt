const dialogflow = require('dialogflow');
const parks = require('../../parks');
const parkNames = require('../../../data/park-names.json');

const { GOOGLE_CLOUD_PROJECT = 'walt-bot' } = process.env;

async function getEntityPaths(client) {
  const agentPath = client.projectAgentPath(GOOGLE_CLOUD_PROJECT);
  const res = await client.listEntityTypes({ parent: agentPath });
  const entityTypes = res[0];

  return entityTypes.reduce(
    (paths, { displayName, name }) => ({ ...paths, [displayName]: name }),
    {},
  );
}

async function refreshParkEntities(client, parent) {
  const entities = Object.entries(parks).map(([parkId, park]) => {
    let synonyms = parkNames[parkId];
    if (!synonyms) {
      synonyms = [park.Name];
    }
    return {
      synonyms,
      value: parkId,
    };
  });

  await client.batchUpdateEntities({
    entities,
    parent,
  });
}

async function refreshEntities() {
  const client = new dialogflow.EntityTypesClient();
  const paths = await getEntityPaths(client);

  await refreshParkEntities(client, paths.park);
}

module.exports = refreshEntities;
