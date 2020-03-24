import 'dotenv/config';

import { resolve } from 'path';
import express from 'express';

// Global Exception handling
import 'express-async-errors';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';

import routes from './routes';

// Calls database to create database connection through models
import './database';

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
    this.exceptionHandler();
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

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }
      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
