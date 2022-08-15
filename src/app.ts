import path from 'path';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import cors from 'cors';

import feathers from '@feathersjs/feathers';
import configuration from '@feathersjs/configuration';
import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';


import { Application } from './declarations';
import logger from './logger';
import middleware from './middleware';
import services from './services';
import appHooks from './app.hooks';
import channels from './channels';
import mongoose from './mongoose';
// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers());

// Load app configuration -> ./config/*, also modifable locally in .env file
app.configure(configuration());
// MIDDLEWARES
// Enable security, CORS, compression, favicon and body parsing
// Additional security headers, check https://developer.mozilla.org/
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(express.json());
// Support Forms, otherwise req.body undefined
app.use(express.urlencoded({ extended: true }));

app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

app.configure(mongoose);

// Configure other middleware (see `middleware/index.ts`)
app.configure(middleware);
// Set up our services (see `services/index.ts`)
app.configure(services);
// Set up event channels (see channels.ts)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger } as any));

app.hooks(appHooks);

export default app;
