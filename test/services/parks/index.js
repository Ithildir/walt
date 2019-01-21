const sinon = require('sinon');
const test = require('ava');
const { getSchedule } = require('../../../lib/services/parks');
const cache = require('../../../lib/services/parks/cache');

const TEST_PARK_ID = 'DisneylandParisMagicKingdom';

test.beforeEach(() => sinon.useFakeTimers());

test.afterEach.always(() => {
  sinon.clock.restore();
  sinon.restore();
});

test.serial('getSchedule returns null if there is no data about the park', t => {
  t.is(getSchedule('foo'), null);
});

test.serial('getSchedule returns null if there the park has no schedule', t => {
  sinon.stub(cache, 'parksData').value({
    [TEST_PARK_ID]: {},
  });

  t.is(getSchedule(TEST_PARK_ID), null);
});

test.serial("getSchedule returns today's opening time if the park is still closed", t => {
  sinon.clock.tick('08:59:59'); // Current time: 08:59:59 UTC = 09:59:59 UTC+1
  sinon.stub(cache, 'parksData').value({
    [TEST_PARK_ID]: {
      schedules: [
        {
          closingTime: '1970-01-01T19:00:00+01:00',
          date: '1970-01-01',
          openingTime: '1970-01-01T10:00:00+01:00',
          type: 'Operating',
        },
      ],
    },
  });

  t.deepEqual(getSchedule(TEST_PARK_ID), { open: false, openingTime: '1970-01-01T10:00:00+01:00' });
});

test.serial("getSchedule returns today's closing time if the park is currently open", t => {
  sinon.clock.tick('09:00:01'); // Current time: 09:00:01 UTC = 10:00:01 UTC+1
  sinon.stub(cache, 'parksData').value({
    [TEST_PARK_ID]: {
      schedules: [
        {
          closingTime: '1970-01-01T19:00:00+01:00',
          date: '1970-01-01',
          openingTime: '1970-01-01T10:00:00+01:00',
          type: 'Operating',
        },
      ],
    },
  });

  t.deepEqual(getSchedule(TEST_PARK_ID), { closingTime: '1970-01-01T19:00:00+01:00', open: true });
});

test.serial("getSchedule returns next operating day's opening time if the park is already closed", t => {
  sinon.clock.tick('18:00:01'); // Current time: 18:00:01 UTC = 19:00:01 UTC+1
  sinon.stub(cache, 'parksData').value({
    [TEST_PARK_ID]: {
      schedules: [
        {
          closingTime: '1970-01-01T19:00:00+01:00',
          date: '1970-01-01',
          openingTime: '1970-01-01T10:00:00+01:00',
          type: 'Operating',
        },
        {
          date: '1970-01-02',
          type: 'Closed',
        },
        {
          closingTime: '1970-01-03T19:00:00+01:00',
          date: '1970-01-03',
          openingTime: '1970-01-03T10:00:00+01:00',
          type: 'Operating',
        },
      ],
    },
  });

  t.deepEqual(getSchedule(TEST_PARK_ID), { open: false, openingTime: '1970-01-03T10:00:00+01:00' });
});

test.serial("getSchedule returns next operating day's opening time if the park is closed for the day", t => {
  sinon.clock.tick('12:00:00'); // Current time: 12:00:00 UTC = 13:00:00 UTC+1
  sinon.stub(cache, 'parksData').value({
    [TEST_PARK_ID]: {
      schedules: [
        {
          date: '1970-01-01',
          type: 'Closed',
        },
        {
          date: '1970-01-02',
          type: 'Closed',
        },
        {
          closingTime: '1970-01-03T19:00:00+01:00',
          date: '1970-01-03',
          openingTime: '1970-01-03T10:00:00+01:00',
          type: 'Operating',
        },
      ],
    },
  });

  t.deepEqual(getSchedule(TEST_PARK_ID), { open: false, openingTime: '1970-01-03T10:00:00+01:00' });
});

test.serial('getSchedule returns no opening time if the park is already closed and there is no more data', t => {
  sinon.clock.tick('18:00:01'); // Current time: 18:00:01 UTC = 19:00:01 UTC+1
  sinon.stub(cache, 'parksData').value({
    [TEST_PARK_ID]: {
      schedules: [
        {
          closingTime: '1970-01-01T19:00:00+01:00',
          date: '1970-01-01',
          openingTime: '1970-01-01T10:00:00+01:00',
          type: 'Operating',
        },
      ],
    },
  });

  t.deepEqual(getSchedule(TEST_PARK_ID), { open: false });
});
