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

// Connect relations

Token.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

module.exports = {
  User,
  Token,
};
