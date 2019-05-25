module.exports = (sequelize, DataTypes) => {
  const MenuRecipe = sequelize.define('menu_recipes', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    menu_id: DataTypes.BIGINT,
    recipe_id: DataTypes.BIGINT,
    week: DataTypes.SMALLINT,
    day: DataTypes.SMALLINT,
    eat_time: DataTypes.SMALLINT,
    dish: DataTypes.SMALLINT,
    portions: DataTypes.SMALLINT,
  }, {
    timestamps: false,
  });
  return MenuRecipe;
};