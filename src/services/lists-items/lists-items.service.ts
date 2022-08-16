// Initializes the `listsItems` service on path `/lists-items`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ListsItems } from './lists-items.class';
import createModel from '../../models/lists-items.model';
import hooks from './lists-items.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'lists-items': ListsItems & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app)/*,
    paginate: app.get('paginate')*/
  };

  // Initialize our service with any options it requires
  app.use('/lists-items', new ListsItems(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('lists-items');

  service.hooks(hooks);
}
