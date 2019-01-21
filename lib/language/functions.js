const moment = require('moment-timezone');
const logger = require('../logger');

function capitalize(s, capitalized) {
  let initial = s.charAt(0);
  if (capitalized) {
    initial = initial.toUpperCase();
  } else {
    initial = initial.toLowerCase();
  }
  return `${initial}${s.slice(1)}`;
}

function unwrapFluentArg(arg) {
  if (!arg || typeof arg.valueOf !== 'function') {
    return arg;
  }
  return arg.valueOf();
}

function formatDuration([mins, capitalized = false]) {
  try {
    const s = moment.duration(unwrapFluentArg(mins), 'm').humanize();
    return capitalize(s, capitalized);
  } catch (err) {
    // Fluent swallows errors thrown from functions, but we want to log them anyway
    logger.error(`Failed to format duration: ${err.message}`, { err, mins });
    throw err;
  }
}

function formatRelativeTime([date, capitalized = false]) {
  try {
    const input = unwrapFluentArg(date);

    let m;
    if (typeof input === 'string') {
      m = moment.parseZone(input);
    } else {
      m = moment(input);
    }

    const s = m.calendar(m.tz(), {
      sameDay() {
        return `[${this.fromNow()}]`;
      },
    });

    return capitalize(s, capitalized);
  } catch (err) {
    // Fluent swallows errors thrown from functions, but we want to log them anyway
    logger.error(`Failed to format relative time: ${err.message}`, { date, err });
    throw err;
  }
}

module.exports = {
  formatDuration,
  formatRelativeTime,
};
