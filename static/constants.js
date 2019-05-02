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

const FOOD_CATEGORIES = {
  0: 'Овощи',
  1: 'Фрукты',
  2: 'Зелень',
  3: 'Мясо',
  4: 'Птица',
  5: 'Рыба',
  6: 'Морепродукты',
}

module.exports = {
  ROLES,
  ROLES_TITLE,
  COMPANY_IMAGE_SCHEMES,
  FOOD_CATEGORIES,
};