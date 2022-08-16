// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { Types } from 'mongoose';
import { IListItem } from '../models/lists-items.model';
import { IUser } from '../models/users.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**
 * Only subscribed user or owners can modify lists
 */
export default (_options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    // missing param required
    if(!(context.data as IListItem).parentList) return context
    // extraction of _id param
    const checker = 
      (item:any) => 
        new Types.ObjectId(item._id).toString() === (context.data as IListItem).parentList.toString()

    if((context.params.user as IUser).ownerLists) {
      if((context.params.user as IUser).ownerLists.findIndex(checker) != -1) return context
    }

    if((context.params.user as IUser).sharedLists) {
      if((context.params.user as IUser).sharedLists.findIndex(checker) != -1) return context
    }
    throw new Error('No permission for modifying current list!')
  };
};
