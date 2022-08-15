// Initializes the `login` service on path `/login`
import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import { Users } from './users.class';
import createModel from '../../models/users.model';
import hooks from './users.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'users': Users & ServiceAddons<any>;
  }
}

/**
 * Initialization of users service
 * @param app app instance
 */
export default function (app: Application): void {
  const options = {
    Model: createModel(app)
  };

  // Initialize our service with any options it requires
  app.use('/users', new Users(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('users');

  service.hooks(hooks);
}
