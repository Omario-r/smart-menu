const Sequelize = require('sequelize');
const DB = require('../../core/db');

const { Op } = Sequelize;
const { isAdminOnlyAuthenticated } = require('../authMiddleware');
const { ROLES } = require('../../static/constants');
const makePassword = require('../utils/password');


function usersList(req, res) {
  const user_id = res.locals.user.id;
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
        { last_name: { [Op.iLike]: `%${filters.s}%` } },
        { fathers_name: { [Op.iLike]: `%${filters.s}%` } },
        { email: { [Op.iLike]: `%${filters.s.toLowerCase()}%` } },
        { phone: { [Op.iLike]: `%${filters.s}%` } },
      ],
    });
  }

  if (filters.role && Object.keys(filters.role).length) {
    where.push({
      role: { [Op.in]: filters.role },
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

    if (sorter.field === 'name') {
      order = [['last_name', sort], ['first_name', sort]];
    } else {
      order = [[sorter.field, sort]];
    }
  }

  DB.User.findAndCountAll({
    attributes:
      { exclude: ['password'] },
    where,
    offset: (page * size),
    limit: size,
    order,
  })
    .then((results) => {
      // eslint-disable-next-line prefer-destructuring
      count = results.count;
      // pages = Math.ceil(count/size); На данном этапе не требуется, компонент использует count

      // Поправляем номер страницы, если с сервера пришел запрос на страницу, больше чем есть
      if (pages === 0) {
        page = pages;
      } else if (pages < (page + 1)) {
        page = pages - 1;
      }

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

function getUser(req, res) {
  const user_id = req.params.id;
  const where = {};
  DB.User.findByPk(user_id, {
    attributes: { },
    where,
  })
    .then((user) => {
      if (user) {
        if (res.locals.user.role !== ROLES.admin) {
          res.status(403).json({ status: 1, error: 'Access forbidden' });
        } else {
          res.json({
            status: 0,
            data: user,
          });
        }
      } else {
        res.status(404).json({ status: 1 });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: 1, error: err });
    });
}

function updateUser(req, res) {
  const r = req.body;
  const user_id = req.params.id;
  DB.User.findByPk(user_id, {})
    .then((user) => {
      if (user) {
        if (res.locals.user.isPartner && user.partner_id !== res.locals.user.partner_id) {
          res.status(403).json({ status: 1, error: 'Access forbidden' });
        } else {
          const password = r.isChanged ? makePassword.hash(r.password) : undefined;
          const userUpd = {
            email: r.email.toLowerCase(),
            phone: r.phone,
            first_name: r.first_name,
            last_name: r.last_name,
            fathers_name: r.fathers_name,
            role: r.role,
            active: r.active,
            removed: false,
            updated_at: new Date(),
            password,
          };

          DB.User.update(userUpd, { where: { id: r.id } })
            .then(() => {
              res.send({ status: 0, user: userUpd });
            });
        }
      } else {
        res.status(404).json({ status: 1 });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: 1, error: err });
    });
}

function addUser(req, res) {
  const r = req.body;
  const { password } = r;
  const user = {
    email: r.email.toLowerCase(),
    phone: r.phone,
    password: makePassword.hash(password),
    first_name: r.first_name,
    last_name: r.last_name,
    fathers_name: r.fathers_name,
    role: r.role,
    active: r.active,
  };

  DB.User.create(user)
    .then((newUser) => {
      res.send({
        status: 0,
        data: newUser,
      });
    });
}

function getEmailsForValidation(req, res) {
  const { email, id: excludedId } = req.body;

  const where = excludedId
    ? { email, removed: false, id: { [Op.ne]: excludedId } }
    : { email, removed: false };

  DB.User.findAll({ where })
    .then(emails => res.send({
      status: 0,
      data: !!emails.length,
    }));
}

function getPhonesForValidation(req, res) {
  const { phone, id: excludedId } = req.body;

  const where = excludedId
    ? { phone, removed: false, id: { [Op.ne]: excludedId } }
    : { phone, removed: false };

  DB.User.findAll({ where })
    .then(phones => res.send({
      status: 0,
      data: !!phones.length,
    }));
}

function userRegistration(req, res) {
  const { email, password } = req.body;
  const lowEmail = email.toLowerCase();

  DB.User.findAll({
    where: {
      email: lowEmail,
    }
  }).then(emails => {
    console.log('emails>>>>>', emails)
    if (emails.length) {
      return res.status(404).json({ status: 1 });
    }
    DB.User.create({
      email: lowEmail,
      password: makePassword.hash(password),
      role: ROLES.user,
      active: true,
    }).then(user => res.send({
      status: 0,
      data: user,
    }))
  })
}

function connect(app) {
  app.get('/users/', isAdminOnlyAuthenticated, usersList);
  app.post('/users', isAdminOnlyAuthenticated, addUser);
  app.put('/users/:id', isAdminOnlyAuthenticated, updateUser);
  app.get('/users/:id', isAdminOnlyAuthenticated, getUser);
  app.post('/users/checkemail', getEmailsForValidation);
  app.post('/users/checkphone', getPhonesForValidation);
  app.post('/users/register', userRegistration)
}

module.exports = { connect };
