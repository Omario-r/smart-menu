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

const WEEK_DAYS = [
  { id: 0, name: 'monday', title: 'Понедельник' },
  { id: 1, name: 'tuesday', title: 'Вторник' },
  { id: 2, name: 'wednesday ', title: 'Среда' },
  { id: 3, name: 'thursday', title: 'Четверг' },
  { id: 4, name: 'friday', title: 'Пятница' },
  { id: 5, name: 'saturday', title: 'Суббота' },
  { id: 6, name: 'sunday', title: 'Воскресенье' }
]

const EAT_TIMES = [
  { id: 0, name: 'breakfast', title: 'Завтрак', recipes: [] },
  { id: 1, name: 'second_supper', title: 'Второй завтрак', recipes: [] },
  { id: 2, name: 'lunch', title: 'Обед', recipes: [] },
  { id: 3, name: 'second_lunch', title: 'Полдник', recipes: [] },
  { id: 4, name: 'dinner', title: 'Ужин', recipes: [] },
  { id: 5, name: 'supper', title: 'Второй ужин', recipes: [] },
]

module.exports = {
  ROLES,
  ROLES_TITLE,
  COMPANY_IMAGE_SCHEMES,
  FOOD_CATEGORIES,
  WEEK_DAYS,
  EAT_TIMES,
};