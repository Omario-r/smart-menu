const Sequelize = require('sequelize');
const DB = require('../db');
const Password = require('../utils/password');
const Dates = require('../utils/dates');
const { ROLES } = require('../../static/constants');

const { Op } = Sequelize;


const { isUserAuthenticated } = require('../authMiddleware');

function adminLogin(req, res) {
  const r = req.body;
  DB.User.findOne({
    where: {
      email: r.email.toLowerCase(),
      // role: { [Op.eq]: ROLES.admin },
      active: true,
      removed: false,
    },
  }).then((user) => {
    if (Password.validate(user.password, r.password)) {
      const token = Password.random(30);
      const expires = Dates.daysFromNow(1);
      DB.Token.create({
        token,
        user_id: user.id,
        expired_at: expires,
        created_at: Dates.now(),
      }).then(() => {
        res.json({
          status: 0,
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
          },
          token,
          expires,
        });
      })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ status: 1, error: err });
        });
    } else {
      res.status(400).json({ status: 1, error: 'Authentication failed' });
    }
  })
    .catch((err) => {
      if (typeof err !== 'string') res.status(err);
      res.status(404).json({ status: 1, error: 'User not found or inactive' });
    });
}

// function publicLogin(req, res) {
//   res.status(402).json({ status: 1, error: 'Access not allow' });
// }

function login(req, res) {
  adminLogin(req, res);
}

function getSelfUser(req, res) {
  res.json({
    status: 0,
    data: {
      user: res.locals.user,
    },
  });
}


function connect(app) {
  app.post('/auth/login', login);
  app.get('/auth/getself', isUserAuthenticated, getSelfUser);
}

module.exports = { connect };
