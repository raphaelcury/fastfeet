import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import Partner from '../app/models/Partner';
import Avatar from '../app/models/Avatar';
import Delivery from '../app/models/Delivery';
import Signature from '../app/models/Signature';
import DeliveryProblem from '../app/models/DeliveryProblem';

import databaseConfig from '../config/database';

const models = [
  User,
  Recipient,
  Partner,
  Avatar,
  Delivery,
  Signature,
  DeliveryProblem,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.sqlConnection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.sqlConnection))
      .map(
        model => model.associate && model.associate(this.sqlConnection.models)
      );
  }
}

export default new Database();
