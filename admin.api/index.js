const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');


const app = express();

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const PORT = parseInt(process.env.ADMIN_PORT, 10) || 3010;
// if (process.env.NODE_ENV !== 'production') {
//   app.use('/images', express.static(`${process.env.STORE_PATH}/images`));
// }

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const migrate = require('../core/db/migrate');

migrate.do();

require('./controllers/auth').connect(app);
require('./controllers/users').connect(app);
require('./controllers/foodstuff').connect(app);
require('./controllers/recipes').connect(app);
require('./controllers/menus').connect(app);

app.listen(PORT, () => {
  console.log(`Smart-menu API server start on port ${PORT}`);
});
