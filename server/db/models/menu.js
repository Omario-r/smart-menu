module.exports = (sequelize, DataTypes) => {
  const Menu = sequelize.define('menu', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    days: DataTypes.JSONB,
    owner_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    menu_users: {
      type: DataTypes.ARRAY(DataTypes.BIGINT),
      defaultValue: [],
    },
    parent_id: DataTypes.BIGINT,
    recipes: {
      type: DataTypes.ARRAY(DataTypes.BIGINT),
      defaultValue: [],
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
  }, {
    timestamps: false,
  });
  return Menu;
}
