
const dateFns = require('date-fns');

const en = require('date-fns/locale/en');
const ru = require('date-fns/locale/ru');

const locales = { en, ru };


function now() {
  return Math.floor(Date.now());
}

function daysFromNow(days) {
  return now() + days * 24 * 3600 * 1000;
}

function hoursFromNow(hours) {
  return now() + hours * 3600 * 1000;
}

function formatDate(dt, format = 'YYYY-MM-DD HH:mm', locale = 'en') {
  if (!dt) return 'Invalid date';
  return dateFns.format(dt, format, { locale: locales[locale] });
}

function getDays(days) {
  return days * 24 * 3600 * 1000;
}

function addDays(d, days) {
  return dateFns.addDays(d, days);
}

const startOfMonth = m => dateFns.startOfMonth(m);

const endOfMonth = m => dateFns.endOfMonth(m);

const startOfDay = m => dateFns.startOfDay(m);

const endOfDay = m => dateFns.endOfDay(m);

const getMonth = m => dateFns.getMonth(m);

const getHumanMonth = m => dateFns.getMonth(m) + 1;

const getYear = m => dateFns.getYear(m);


module.exports = {
  now,
  daysFromNow,
  hoursFromNow,
  formatDate,
  getDays,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  getMonth,
  getHumanMonth,
  getYear,
  addDays,
};
