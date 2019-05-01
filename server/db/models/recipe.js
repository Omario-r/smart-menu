module.exports = (sequelize, DataTypes) => {
  const Resipe = sequelize.define('recipe', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    foodstuff: {
      type: DataTypes.ARRAY(DataTypes.BIGINT),
      defaultValue: [],
    },
    description: DataTypes.STRING,
    public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    owner_id: DataTypes.BIGINT,
    recipe_users: {
      type: DataTypes.ARRAY(DataTypes.BIGINT),
      defaultValue: [],
    },
    parent_id: DataTypes.BIGINT,
  }, {
      timestamps: false,
    });
    return Resipe;
  };