// See http://mongoosejs.com/docs/models.html
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

/**
 * Generic function for creating mongo based models and schemas
 * @param app app instance
 * @param modelName name of model. collection
 * @param schemaDefinition schema for defined document
 * @returns created model
 */
export default function<Type> (app: Application, modelName : string, schemaDefinition : Type): Model<Type> {
  const mongooseClient: Mongoose = app.get('mongooseClient');

  // schema definition
  const schema = new mongooseClient.Schema(schemaDefinition, 
    {
      timestamps: true
    });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  // init model
  return mongooseClient.model<Type>(modelName, schema);
}
