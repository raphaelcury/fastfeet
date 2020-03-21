import 'dotenv/config';

import { resolve } from 'path';
import express from 'express';

import routes from './routes';

// Calls database to create database connection through models
import './database';

// TODO: Add exceptions handling

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());

    // 'GET' for static files
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
