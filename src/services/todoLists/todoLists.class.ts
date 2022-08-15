import { Id, NullableId, Paginated, Params } from '@feathersjs/feathers';
import { Service, MongooseServiceOptions } from 'feathers-mongoose';
import { Application } from '../../declarations';
import { IList } from '../../models/todoLists.model';

export class TodoLists extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  app: Application;
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  /**
   * Filled with owner id
   * @param data 
   * @param params 
   * @returns 
   */
  async create(data: Partial<any> | Partial<any>[], params?: Params | undefined) {
    (data as Partial<IList>).owner = params?.user?._id
    return super.create(data, params)
  }
}
