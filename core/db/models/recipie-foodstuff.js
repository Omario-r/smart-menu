module.exports = (sequelize, DataTypes) => {
  const RecipeFoodstuff = sequelize.define('recipe_foodstuffs', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    recipe_id: DataTypes.BIGINT,
    foodstuff_id: DataTypes.BIGINT,
    weight_recipe: DataTypes.INTEGER,
    weight_portion: DataTypes.INTEGER,
  }, {
    timestamps: false,
  });
  return RecipeFoodstuff;
};