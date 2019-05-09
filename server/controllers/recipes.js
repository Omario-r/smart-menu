const Sequelize = require('sequelize');
const DB = require('../db');

const { Op } = Sequelize;
const { isAdminOnlyAuthenticated } = require('../authMiddleware');
const { ROLES } = require('../../static/constants');



function recipesList(req, res) {
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

  DB.Recipe.findAndCountAll({
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

function getRecipe(req, res) {
  const recipe_id = req.params.id;
  DB.Recipe.findByPk(recipe_id, {
    include: {
      model: DB.RecipeFoodstuff,
      where: { recipe_id },
      include: DB.Foodstuff,
    }
  })
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).json({ status: 1 });
      }
      return res.json({
        status: 0,
        data: recipe,
      });
    })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ status: 1, error: err });
      });
  }

function updateRecipe(req, res) {
  const r = req.body;
  const recipe_id = req.params.id;
  DB.Recipe.findByPk(recipe_id)
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).json({ status: 1 });
      }

      DB.RecipeFoodstuff.destroy({
        where: { recipe_id }
      }).then(() => r.recipe_foodstuffs.map(fs => 
        DB.RecipeFoodstuff.create({
          recipe_id: recipe.id,
          foodstuff_id: fs.foodstuff_id,
          weight_recipe: fs.weight_recipe,
          weight_portion: Math.round(fs.weight_recipe / r.portions),
        })))

      recipe.name = r.name;
      recipe.portions = r.portions;
      recipe.description = r.description;
      recipe.save();
      res.send({
        status: 0,
        data: recipe,

      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: 1, error: err });
    });
}

function addRecipe(req, res) {
  const { user } = res.locals;
  const r = req.body;
  const recipeCr = {
    name: r.name,
    portions: r.portions,
    owner_id: user.id,
    description: r.description,
  };

  DB.Recipe.create(recipeCr)
    .then((recipe) => {
     r.recipe_foodstuffs.map((fs) => {
      const record = {
        recipe_id: recipe.id,
        foodstuff_id: fs.foodstuff_id,
        weight_recipe: fs.weight_recipe,
        weight_portion: fs.weight_portion,
      }
       DB.RecipeFoodstuff.create(record)
     })
      res.send({
        status: 0,
        data: recipe,
      });
    });
}

function connect(app) {
  app.get('/recipes', isAdminOnlyAuthenticated, recipesList);
  app.post('/recipes', isAdminOnlyAuthenticated, addRecipe);
  app.put('/recipes/:id', isAdminOnlyAuthenticated, updateRecipe);
  app.get('/recipes/:id', isAdminOnlyAuthenticated, getRecipe);
}

module.exports = { connect };