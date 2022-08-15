import { Id, NullableId, Params } from '@feathersjs/feathers';
import { Service, MongooseServiceOptions } from 'feathers-mongoose';

import { Application } from '../../declarations';

export class Users extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
  }

  async patch(id: NullableId, data: Partial<any>, params?: Params | undefined) {
    id = params?.user?._id;
    return super.patch(id, {password: data.password}, params);
  }

  async update(id: Id, data: any, params?: Params | undefined) {
    id = params?.user?._id;
    return super.update(id, data, params);
  }
}
