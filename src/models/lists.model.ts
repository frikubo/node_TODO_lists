// lists-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
import { Application } from '../declarations';
import constructModel from './model';

import { Model, Types } from 'mongoose';

/**
 * Interface for list document structure
 */
export interface IList {
  /**
   * Owner of created list
   */
  owner: any,
  /**
   * List title
   */
  listName: string | object;
  /**
   * All items created inside list
   */
  todoItems: any ;
  /**
   * Users the owner shares list with
   */
  sharedTo: any;
}

/**
 * Create mongoose model of todo list
 * @param app app instance
 * @returns ceated model that contins schema
 */
export default function (app: Application): Model<IList> {
  return constructModel<IList>(app, 'lists', {
    owner: { type: Types.ObjectId, lowercase: true, required: true, index: true },
    listName: { type: String, required: true },
    todoItems: { type: [Types.ObjectId]},
    sharedTo: { type: [Types.ObjectId]}
  });
}
