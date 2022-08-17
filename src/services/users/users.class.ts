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

  /**
   * Patch for password modifications of specific user
   * @param id 
   * @param data 
   * @param params 
   * @returns 
   */
  async patch(id: NullableId, data: Partial<any>, params?: Params | undefined) {
    // internal service call
    if(params)
      id = params?.user?._id;
    // only passwword change allowed
    console.log(data.password)
    return super.patch(id, {password: data.password}, params);
  }
}
