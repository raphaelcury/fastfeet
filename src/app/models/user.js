module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password_hash: DataTypes.STRING,
      admin: DataTypes.BOOLEAN,
    },
    {}
  );
  User.associate = function() {
    // associations can be defined here
  };
  return User;
};
