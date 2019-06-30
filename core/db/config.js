module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'smartmenu_user',
    password: process.env.DB_PASSWORD || 'smartmenu',
    database: process.env.DB_NAME || 'smartmenu',
    host: process.env.DB_HOSTNAME || '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: '',
    password: null,
    database: '',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'postgres',
  },
};
