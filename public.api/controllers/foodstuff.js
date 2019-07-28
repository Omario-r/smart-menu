const Sequelize = require('sequelize');
const DB = require('../../core/db');

const { Op } = Sequelize;
const { isAdminOrEditorAuthenticated, isUserAuthenticated } = require('../authMiddleware');
const { ROLES } = require('../../static/constants');



function foodstuffList(req, res) {
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

  DB.Foodstuff.findAndCountAll({
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

      return res.json({
        status: 0,
        pagination,
        data: results.rows,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: 1, error: err });
    });
}

function getFoodstuff(req, res) {
  const foodstuff_id = req.params.id;
  DB.Foodstuff.findByPk(foodstuff_id)
    .then((foodstuff) => {
      if (!foodstuff) {
        return res.status(404).json({ status: 1 });
      }
      return res.json({
        status: 0,
        data: foodstuff,
      });
    })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ status: 1, error: err });
      });
  }

function updateFoodstuff(req, res) {
  const r = req.body;
  const foodstuff_id = req.params.id;
  DB.Foodstuff.findByPk(foodstuff_id)
    .then((foodstuff) => {
      if (!foodstuff) {
        res.status(404).json({ status: 1 });
      }
      foodstuff.name = r.name;
      foodstuff.category = r.category;
      foodstuff.save();
      res.send({
        status: 0,
        data: foodstuff
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: 1, error: err });
    });
}

function addFoodstuff(req, res) {
  const r = req.body;
  const foodstuff = {
    name: r.name,
    category: r.category,
  };

  DB.Foodstuff.create(foodstuff)
    .then((newFoodstuff) => {
      res.send({
        status: 0,
        data: newFoodstuff,
      });
    });
}

function getFoodstuffList(req, res) {
  const category = req.params.id;
  if (category === 'new') {
    return res.send({
      status: 0,
      data: [],
    })
  }

  DB.Foodstuff.findAll({
    where: { category },
  }).then(foodstuffs => 
    res.send({
      status: 0,
      data: foodstuffs
    })
    )
}

function connect(app) {
  app.get('/foodstuff', isAdminOrEditorAuthenticated, foodstuffList);
  app.post('/foodstuff', isAdminOrEditorAuthenticated, addFoodstuff);
  app.put('/foodstuff/:id', isAdminOrEditorAuthenticated, updateFoodstuff);
  app.get('/foodstuff/:id', isAdminOrEditorAuthenticated, getFoodstuff);
  app.get('/foodstuff/category/:id', isUserAuthenticated, getFoodstuffList);
}

module.exports = { connect };
