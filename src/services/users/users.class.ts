import { NullableId, Paginated, Params } from '@feathersjs/feathers';
import { Service, MongooseServiceOptions } from 'feathers-mongoose';

import { Application } from '../../declarations';

/**
 * Service for users and authentication interaction
 * TODO - some roles for access requests
 */
export class Users extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
  }
}
