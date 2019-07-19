const Sequelize = require('sequelize');
const DB = require('../../core/db');

const { Op } = Sequelize;
const { isUserAuthenticated } = require('../authMiddleware');
const { ROLES, WEEK_DAYS, EAT_TIMES } = require('../../static/constants');
const menusDal = require('../dal/menus')

function userMemusList(req, res) {
  const { user } = res.locals;
  menusDal.menusList(req, res, user.id)
    .then(({ pagination, data }) => res.json({
      status: 0,
      pagination,
      data,
    }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: 1, error: err });
    });
}

function allMenusList(req, res) {
  menusDal.menusList(req, res)
    .then(({ pagination, data }) => res.json({
      status: 0,
      pagination,
      data,
    }))
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

      // if (r.menu_recipes.length > 0) {
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
      // }
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
  app.get('/menus', isUserAuthenticated, allMenusList);
  app.get('/user-menus', isUserAuthenticated, userMemusList);
  app.post('/menus', isUserAuthenticated, addMenu);
  app.put('/menus/:id', isUserAuthenticated, updateMenu);
  app.get('/menus/:id', isUserAuthenticated, getMenu);
}

module.exports = { connect };