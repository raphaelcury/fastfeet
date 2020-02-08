import express from 'express';

import routes from './routes';
import './database';
// invoca o database criando a conexão com o banco através dos models

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
