// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { IUser } from '../models/users.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**
 * Only owner or subscriber can modify list
 */
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    // extraction of _id param
    const checker = 
      (item: { _id: string; }) => item._id.toString() === context.id

    // only owner can modify list
    if((context.params.user as IUser).ownerLists.some(checker)) {
        return context;
    }

    if((context.params.user as IUser).sharedLists.some(checker)) {
      return context;
  }
    throw new Error('No permission for modifying current list!')
  };
};
