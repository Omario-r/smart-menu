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
      defaultValue: true,
    },
    owner_id: DataTypes.BIGINT,
    recipe_users: {
      type: DataTypes.ARRAY(DataTypes.BIGINT),
      defaultValue: [],
    },
    parent_id: DataTypes.BIGINT,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    portions: DataTypes.SMALLINT,
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
  }, {
      timestamps: false,
    });
    return Resipe;
  };