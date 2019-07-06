const Postgrator = require('postgrator');
const path = require('path');

const config = process.env.NODE_ENV === 'production' ? require('./config').production : require('./config').development;

const postgrator = new Postgrator({
  // Directory containing migration files
  migrationDirectory: path.resolve(__dirname, 'migrations'),
  // or a glob pattern to files
  // migrationPattern: __dirname + '/some/pattern/*',
  // Driver: must be pg, mysql, or mssql
  driver: 'pg',
  // Database connection config
  host: '127.0.0.1',
  port: 5432,
  database: config.database,
  username: config.username,
  password: config.password,
  // Schema table name. Optional. Default is schemaversion
  // If using Postgres, schema may be specified using . separator
  // For example, { schemaTable: 'schema_name.table_name' }
  // schemaTable: 'schemaversion'
  // ssl: true
});

module.exports = {
  do() {
    postgrator
      .migrate()
      .then(appliedMigrations => console.log(appliedMigrations))
      .catch(error => console.log(error));
  },
};
