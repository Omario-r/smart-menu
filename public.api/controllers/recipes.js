const Sequelize = require('sequelize');
const DB = require('../../core/db');
const RecipeDal = require('../dal/recipes');

const { Op } = Sequelize;
const { isUserAuthenticated } = require('../authMiddleware');
const { ROLES } = require('../../static/constants');

function userRecipesList(req, res) {
  const { user } = res.locals;
  RecipeDal.recipesList(req, res, user.id)
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

function allRecipesList(req, res) {
  RecipeDal.recipesList(req, res)
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

function cloneRecipe(req, res) {
  const { user } = res.locals;
  const recipe_id = req.params.id;

  DB.Recipe.findByPk(recipe_id, {
    include: {
      model: DB.RecipeFoodstuff,
      where: { recipe_id },
    }
  })
    .then((cloningRecipe) => {
      if (!cloningRecipe) {
        return res.status(404).json({ status: 1 });
      }

      const { name, description, portions } = cloningRecipe;

      DB.Recipe.create({
        name,
        description,
        portions,
        owner_id: user.id,
        parent_id: recipe_id,
        public: false,
      })
      .then((newRecipe) => {
        cloningRecipe.recipe_foodstuffs.map((fs) => {
        const record = {
          recipe_id: newRecipe.id,
          foodstuff_id: fs.foodstuff_id,
          weight_recipe: fs.weight_recipe,
          weight_portion: fs.weight_portion,
        }
         DB.RecipeFoodstuff.create(record)
       })
        res.send({
          status: 0,
          data: newRecipe,
        });
      });

    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: 1, error: err });
    });
}

function connect(app) {
  app.get('/recipes', isUserAuthenticated, allRecipesList);
  app.get('/user-recipes', isUserAuthenticated, userRecipesList);
  app.post('/recipes', isUserAuthenticated, addRecipe);
  app.put('/recipes/:id', isUserAuthenticated, updateRecipe);
  app.get('/recipes/:id', isUserAuthenticated, getRecipe);
  app.get('/recipes-clone/:id', isUserAuthenticated, cloneRecipe);
}

module.exports = { connect };