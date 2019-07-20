const DB = require('../../core/db');


function recipesList(req, res, user_id) {
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

    // if (user_id) {
    //     where.push({
    //         id: user_id,
    //     })
    // }
  
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
  
    return DB.Recipe.findAndCountAll({
      where,
      offset: (page * size),
      limit: size,
      order,
    })
      .then((results) => {
        // eslint-disable-next-line prefer-destructuring
        count = results.count;
        // Поправляем номер страницы, если с сервера пришел запрос на страницу, больше чем есть
        // if (pages === 0) {
        //   page = pages;
        // } else if (pages < (page + 1)) {
        //   page = pages - 1;
        // }
  
        pagination = {
          total: count,
          // pages,
          // size,
          page,
        };
  
        return { pagination, data: results.rows };
      })
  }

module.exports = {
    recipesList
}
