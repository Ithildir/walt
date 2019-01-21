const Themeparks = require('themeparks');
const dialogflow = require('dialogflow');

const parkNames = require('../../../data/park-names.json');

async function getEntityPaths(client) {
  const agentPath = client.projectAgentPath(process.env.GOOGLE_CLOUD_PROJECT);
  const res = await client.listEntityTypes({ parent: agentPath });
  const entityTypes = res[0];

  return entityTypes.reduce(
    (paths, { displayName, name }) => ({ ...paths, [displayName]: name }),
    {},
  );
}

async function refreshParkEntities(client, parent) {
  const entities = Object.keys(Themeparks.Parks).map(parkId => {
    let synonyms = parkNames[parkId];
    if (!synonyms) {
      const park = new Themeparks.Parks[parkId]();
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
