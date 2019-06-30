
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('tokens', {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    user_id: DataTypes.INTEGER,
    expired_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
  }, {
    timestamps: false,
  });
  Token.removeAttribute('id');
  return Token;
};
