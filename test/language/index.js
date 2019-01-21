const moment = require('moment-timezone');
const test = require('ava');
const { getMessage, initLanguage } = require('../../lib/language');

const PARK_NAME = 'Hong Kong Disneyland';
const TZ = 'Asia/Hong_Kong';

test.before(() => initLanguage());

test('DURATION function works correctly', t => {
  t.is(
    getMessage('tell-park-crowd-is-0-level', {
      avgWaitMins: 15,
      lastUpdate: moment()
        .subtract(10, 'm')
        .valueOf(),
      parkName: PARK_NAME,
    }),
    `${PARK_NAME} is definitely a ghost town! 10 minutes ago, the average wait time was only 15 minutes.`,
  );
});

test('RELTIME function works correctly', t => {
  t.is(
    getMessage('tell-park-is-closed-and-will-reopen', {
      openingTime: moment
        .tz(TZ)
        .add(1, 'd')
        .hour(9)
        .startOf('h')
        .toISOString(true),
      parkName: PARK_NAME,
    }),
    `${PARK_NAME} is closed right now, and it will reopen tomorrow at 9:00 AM.`,
  );

  t.is(
    getMessage('tell-park-is-closed-and-will-reopen', {
      openingTime: moment
        .tz(TZ)
        .add(5, 'm')
        .toISOString(true),
      parkName: PARK_NAME,
    }),
    `${PARK_NAME} is closed right now, and it will reopen in 5 minutes.`,
  );
});
