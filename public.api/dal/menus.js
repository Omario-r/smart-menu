const Sequelize = require('sequelize');
const DB = require('../../core/db');

const { Op } = Sequelize;
const { isUserAuthenticated } = require('../authMiddleware');
const { ROLES, WEEK_DAYS, EAT_TIMES } = require('../../static/constants');


function menusList(req, res, user_id) {
  const jq = JSON.parse(req.query.jq);
  let { pagination } = jq;
  const { filters, sorter } = jq;


  const size = pagination.size || 10;
  let page = pagination.page ? pagination.page : 0;
  let count;
  let pages;

  let where = [];
  let order = [];

  // let whereS = {};
  // let whereRole = {};


  // Формируем условия запроса к базе

  if (filters.s) {
    where.push({
      [Op.or]: [
        { first_name: { [Op.iLike]: `%${filters.s}%` } },
      ],
    });
  }

  if (user_id) {
    where.push({
      id: user_id
    })
  }

  // final where
  where = where.length > 1 ? {
    [Op.and]: where,
  } : where[0];

  // Сортировка
  let sort;
  if (sorter.field) {
    if (sorter.order === 'descend') {
      sort = 'DESC';
    } else {
      sort = 'ASC';
    }
    order = [[sorter.field, sort]];
  }

  return DB.Menu.findAndCountAll({
    where,
    offset: (page * size),
    limit: size,
    order,
  })
    .then((results) => {
      count = results.count;
      pagination = {
        total: count,
        page,
      };

      return { pagination, data: results.rows }
    })
}

module.exports = {
  menusList 
}
