const Sequelize = require('sequelize');
const DB = require('../core/db');
const Dates = require('./utils/dates');
const { ROLES } = require('../static/constants');

const { Op } = Sequelize;


function getBearerToken(header) {
  return header;
}

function verifyTokenAndGetUser(token) {
  return new Promise((resolve, reject) => {
    DB.Token.findOne({
      where: {
        token,
        expired_at: { [Op.gt]: Dates.now() },
      },
      include: [{
        model: DB.User,
        where: { active: true, removed: false },
      }],
    }).then((user) => {
      if (user) {
        resolve(user.user);
      } else reject('Token invalid');
    });
  });
}

// Only check Admin API token and return user
function isAuthenticated(req) {
  return new Promise((resolve, reject) => {
    const authHeader = req.headers.authorization;
    // if (req.headers['x-api-role'] !== 'admin')
    // { reject({ status: 403, message: 'You are not admin' }) };
    if (!authHeader) {
      return reject({});
    }
    const token = getBearerToken(authHeader);
    if (token) {
      return verifyTokenAndGetUser(token)
        .then((user) => {
          resolve(user);
        })
        .catch(() => {
          reject({ status: 401, message: 'Unauthrorized' });
        });
    }
    return reject({});
  });
}

// Middleware
function isAdminOnlyAuthenticated(req, res, next) {
  isAuthenticated(req).then((user) => {
    if (user.role === ROLES.admin) {
      res.locals.user = user;
      return next();
    }
    return res.status(403).json({ status: 403, message: 'Forbidden' });
  })
    .catch(err => res.status(err.status || 403)
      .json({
        status: err.status || 403,
        message: err.message || 'Forbidden',
      }));
}

function isAdminOrEditorAuthenticated(req, res, next) {
  isAuthenticated(req).then((user) => {
    if (user.role === ROLES.admin || user.role === ROLES.editor) {
      res.locals.user = user;
      return next();
    }
    return res.status(403).json({ status: 403, message: 'Forbidden' });
  })
    .catch(err => res.status(err.status || 403)
      .json({
        status: err.status || 403,
        message: err.message || 'Forbidden',
      }));
}

function isUserAuthenticated(req, res, next) {
  isAuthenticated(req).then((user) => {
    if (user.role === ROLES.admin || user.role === ROLES.editor || user.role === ROLES.user) {
      res.locals.user = user;
      return next();
    }
    return res.status(403).json({ status: 403, message: 'Forbidden' });
  })
    .catch(err => res.status(err.status || 403)
      .json({
        status: err.status || 403,
        message: err.message || 'Forbidden',
      }));
}

module.exports = {
  isAdminOnlyAuthenticated,
  isUserAuthenticated,
  isAdminOrEditorAuthenticated,
};
