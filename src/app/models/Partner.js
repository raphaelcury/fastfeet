import Sequelize, { Model } from 'sequelize';

class Partner extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.hasOne(models.Avatar, { foreignKey: 'partner_id', as: 'avatar' });
  }
}

export default Partner;
