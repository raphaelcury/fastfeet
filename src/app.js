import 'dotenv/config';

import express from 'express';

import routes from './routes';
import './database';
// Calls database to create database connection through models

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
