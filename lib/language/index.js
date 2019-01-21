const fs = require('fs');
const path = require('path');
const snakeCase = require('snake-case');
const { promisify } = require('util');
const { FluentBundle } = require('fluent');
const { formatDuration, formatRelativeTime } = require('./functions');
const logger = require('../logger');

let bundle;
const variantCounts = new Map();

function getMessage(key, args) {
  let id = key;
  const count = variantCounts.get(key);
  if (count) {
    const variant = Math.floor(Math.random() * (count - 1)) + 1;
    id = `${key}-${variant}`;
  }

  const message = bundle.getMessage(id);

  const snakeCaseArgs = {};
  if (args) {
    Object.keys(args).forEach(k => {
      snakeCaseArgs[snakeCase(k)] = args[k];
    });
  }

  const value = bundle.format(message, snakeCaseArgs);

  return value;
}

async function initLanguage() {
  const content = await promisify(fs.readFile)(path.resolve(__dirname, 'en.ftl'), 'utf8');

  bundle = new FluentBundle('en', {
    functions: {
      DURATION: formatDuration,
      RELTIME: formatRelativeTime,
    },
    useIsolating: false,
  });

  const errs = bundle.addMessages(content);
  if (errs.length > 0) {
    logger.error('Failed to load messages', errs);
    throw errs[0];
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const [id] of bundle.messages) {
    const pos = id.lastIndexOf('-');

    if (pos !== -1) {
      const variantNum = parseInt(id.slice(pos + 1), 10);

      if (Number.isInteger(variantNum)) {
        const key = id.slice(0, pos);
        variantCounts.set(key, (variantCounts.get(key) || 0) + 1);
      }
    }
  }
}

module.exports = {
  getMessage,
  initLanguage,
};
