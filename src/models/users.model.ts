// users-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
import { Application } from '../declarations';
import constructModel from './model';

import { Model, Types } from 'mongoose';

/**
 * Interface for User document structure
 */
export interface IUser {
  /**
   * Unique user email
   */
  email: string | object;
  /**
   * User´s password
   */
  password: string | object;
}

/**
 * Create mongoose model of user
 * @param app app instance
 * @returns ceated model that contins schema
 */
export default function (app: Application): Model<IUser> {
  return constructModel<IUser>(app, 'users', {
    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, required: true }
  });
}
