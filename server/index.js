const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const PORT = parseInt(process.env.PORT, 10) || 3010;

const app = express();

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// if (process.env.NODE_ENV !== 'production') {
//   app.use('/images', express.static(`${process.env.STORE_PATH}/images`));
// }

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const migrate = require('./db/migrate');

migrate.do();

require('./controllers/auth').connect(app);
require('./controllers/users').connect(app);
require('./controllers/foodstuff').connect(app);

app.listen(PORT, () => {
  console.log(`Smart-menu API server start on port ${PORT}`);
});
