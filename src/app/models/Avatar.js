import Sequelize, { Model } from 'sequelize';
import 'dotenv/config';

class Avatar extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/files/avatars/${this.path}`;
          },
        },
      },
      { sequelize }
    );
    return this;
  }
}

export default Avatar;
