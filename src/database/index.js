import Sequelize from 'sequelize';

import File from '../app/models/File';
import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import Partner from '../app/models/Partner';
import Delivery from '../app/models/Delivery';
import DeliveryProblem from '../app/models/DeliveryProblem';

import databaseConfig from '../config/database';

const models = [File, User, Recipient, Partner, Delivery, DeliveryProblem];

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
