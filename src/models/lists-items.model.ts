// lists-items-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
import { Application } from '../declarations';
import constructModel from './model';

import { Model, Types } from 'mongoose';

/**
 * Interface for list item document structure
 */
export interface IListItem {
  /**
   * List that contains this item
   */
  parentList : Types.ObjectId | object;
  /**
   * Title of item
   */
  title: string | object;
  /**
   * Description
   */
  text: string | object;
  /**
   * Deadline
   */
  deadline: EpochTimeStamp | object;
  /**
   * Creator of item
   */
  user: Types.ObjectId | object;
}

/**
 * Create mongoose model of todo list
 * @param app app instance
 * @returns ceated model that contins schema
 */
export default function (app: Application): Model<IListItem> {
  return constructModel<IListItem>(app, 'listsItems', {
    parentList : { type: Types.ObjectId, lowercase: true, required:true, ref:'lists' },
    title: { type: String, required: true},
    text: { type: String, required: true },
    deadline: { type: Types.Decimal128, required: true },
    user: { type: Types.ObjectId, ref:'users' }
  });
}
