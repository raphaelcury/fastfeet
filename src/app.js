import 'dotenv/config';

import { resolve } from 'path';
import express from 'express';
import 'express-async-errors';

// Global Exception handling
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';

import routes from './routes';

// Calls database to create database connection through models
import './database';

// TODO: Add exceptions handling

class App {
  constructor() {
    // Server init
    this.server = express();

    // Global exception handling init
    Sentry.init(sentryConfig);
    this.server.use(Sentry.Handlers.requestHandler());

    // Middlewares and routes
    this.middlewares();
    this.routes();

    // Global exception handling
    this.server.use(Sentry.Handlers.errorHandler());
  }

  middlewares() {
    // Global JSON translation
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
