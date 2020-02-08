module.exports = (sequelize, DataTypes) => {
  const Recipient = sequelize.define(
    'Recipient',
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      number: DataTypes.INTEGER,
      complement: DataTypes.STRING,
      state: DataTypes.STRING,
      city: DataTypes.STRING,
      zip_code: DataTypes.STRING,
    },
    {}
  );
  Recipient.associate = function() {
    // associations can be defined here
  };
  return Recipient;
};
