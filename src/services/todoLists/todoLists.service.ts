// Initializes the `app` service on path `/app`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { TodoLists } from './todoLists.class';
import createModel from '../../models/todoLists.model';
import hooks from './todoLists.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'lists': TodoLists & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app)
  };

  // Initialize our service with any options it requires
  app.use('/lists', new TodoLists(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('lists');

  service.hooks(hooks);
}
