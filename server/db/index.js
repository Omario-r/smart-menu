require('pg').defaults.parseInt8 = true;

const Sequelize = require('sequelize');

const config = process.env.NODE_ENV === 'production'
  ? require('./config').production
  : require('./config').development;

const sequelize = new Sequelize({
  database: config.database,
  username: config.username,
  password: config.password,
  dialect: 'postgres',
});


// Connect Models

const User = require('./models/user')(sequelize, Sequelize);
const Token = require('./models/token')(sequelize, Sequelize);
const Foodstuff = require('./models/foodstuff')(sequelize, Sequelize);
const Menu = require('./models/menu')(sequelize, Sequelize);
const Recipe = require('./models/recipe')(sequelize, Sequelize);

// Connect relations

Token.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
Menu.belongsTo(User, { foreignKey: 'owner_id', targetKey: 'id' });
Recipe.belongsTo(User, { foreignKey: 'owner_id', targetKey: 'id' });

module.exports = {
  User,
  Token,
  Foodstuff,
  Menu,
  Recipe,
};
