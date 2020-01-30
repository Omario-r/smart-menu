module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    fathers_name: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.INTEGER,
    // roles: 1 - user, 2 - editor,3 - admin
    active: DataTypes.BOOLEAN,
    removed: DataTypes.BOOLEAN,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: () => new Date(),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: () => new Date(),
    },
  }, {
    timestamps: false,
  });
  return User;
};
