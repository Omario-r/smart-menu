import m from 'moment';
require('moment/locale/ru');
//require('moment/locale/en');
m.locale('ru');

const formatDateTime = (d) => m(d).format('L LT');

const formatDate = (d) => m(d).format('L');

const formatDateTimeAndAddDays = (d, days) => m(d).add(days, 'days').format('L LT');

const format = (d, f) => m(d).format(f);

const simpleDate = (d) => {
  d = m(d)
  return d.year() * 10000 + (d.month()+1)*100 + d.date();
}

const datesRange = (start, end) => {
  let d = [];
  start.add(-1, 'days');
  if (start.isAfter(end)) return d;
  while(start.isBefore(end)) {
    start.add(1, 'days');
    d.push(start.clone());
  }
  return d;
}

function days(days) {
  return days * 24 * 3600 * 1000;
}

export default {
  formatDateTime,
  formatDate,
  format,
  days,
  formatDateTimeAndAddDays,
  simpleDate,
  datesRange,
}
