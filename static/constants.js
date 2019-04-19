const ROLES = {
  client: 0,
  company: 1,
  admin: 3,
};

const ROLES_TITLE = {
  0: 'Клиент',
  1: 'Компания',
  3: 'Администратор',
}

const COMPANY_IMAGE_SCHEMES = {
  orig: { size: 800, format: 'jpeg' },
  200: { size: 200, format: 'jpeg' },
  100: { size: 100, format: 'jpeg' },
};

module.exports = {
  ROLES,
  ROLES_TITLE,
  COMPANY_IMAGE_SCHEMES,
};