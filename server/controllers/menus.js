const Sequelize = require('sequelize');
const DB = require('../db');

const { Op } = Sequelize;
const { isAdminOnlyAuthenticated } = require('../authMiddleware');
const { ROLES, WEEK_DAYS, EAT_TIMES } = require('../../static/constants');



function menusList(req, res) {
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

  DB.Menu.findAndCountAll({
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

function getMenu(req, res) {
  const menu_id = req.params.id;
  DB.Menu.findByPk(menu_id, {
    include: {
      model: DB.MenuRecipes,
      include: {
        model: DB.Recipe,
        include: {
          model: DB.RecipeFoodstuff,
          include: DB.Foodstuff,
        }
      },
    }
  })
    .then((menu) => {
      if (!menu) {
        return res.status(404).json({ status: 1 });
      }

      return res.json({
        status: 0,
        data: menu,
      });
    })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ status: 1, error: err });
      });
  }

function updateMenu(req, res) {
  const r = req.body;
  const menu_id = req.params.id;
  DB.Menu.findByPk(menu_id)
    .then((menu) => {
      if (!menu) {
        return res.status(404).json({ status: 1 });
      }
      menu.name = r.name;
      menu.weeks = r.weeks;
      menu.description = r.description;
      menu.save();

      if (r.menu_recipes.length > 0) {
        DB.MenuRecipes.destroy({
          where: { menu_id }
        }).then(() => r.menu_recipes.map(menuRecipe => {
          // if week was deleted we don't need its recipes
          if (r.weeks.includes(menuRecipe.week)) {
            return DB.MenuRecipes.create({
              menu_id,
              recipe_id: menuRecipe.recipe_id,
              week: menuRecipe.week,
              day: menuRecipe.day,
              eat_time: menuRecipe.eat_time,
              portions: menuRecipe.portions,
            })
          }
          return;
        }))
      }
      return res.send({
        status: 0,
        data: menu,

      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: 1, error: err });
    });
}

function addMenu(req, res) {
  const { user } = res.locals;
  const r = req.body;
  const menu = {
    name: r.name,
    owner_id: user.id,
    description: r.description,
    weeks: r.weeks,
  };

  DB.Menu.create(menu)
    .then((newMenu) => {
      return res.send({
        status: 0,
        data: newMenu,
      });
    });
}

function connect(app) {
  app.get('/menus', isAdminOnlyAuthenticated, menusList);
  app.post('/menus', isAdminOnlyAuthenticated, addMenu);
  app.put('/menus/:id', isAdminOnlyAuthenticated, updateMenu);
  app.get('/menus/:id', isAdminOnlyAuthenticated, getMenu);
}

module.exports = { connect };