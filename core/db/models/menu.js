module.exports = (sequelize, DataTypes) => {
  const Menu = sequelize.define('menu', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    owner_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    weeks: {
      type: DataTypes.ARRAY(DataTypes.SMALLINT),
      defaultValue: [],
    },
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
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
