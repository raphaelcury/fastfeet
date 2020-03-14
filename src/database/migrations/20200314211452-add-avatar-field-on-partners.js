module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('partners', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'avatars', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
      unique: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('partners', 'avatar_id');
  },
};
