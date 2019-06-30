module.exports = (sequelize, DataTypes) => {
  const Foodstuff = sequelize.define('foodstuff', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    category: DataTypes.INTEGER,
    compatibility_ids: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
    gluten_free: DataTypes.BOOLEAN,
    glycemic_index: DataTypes.INTEGER,
  }, {
    timestamps: false,
  });
  return Foodstuff;
};