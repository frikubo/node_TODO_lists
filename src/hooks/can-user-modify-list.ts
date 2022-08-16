// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { IListItem } from '../models/lists-items.model';
import { IUser } from '../models/users.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    // extraction of _id param
    const checker = 
      (item: { _id: string; }) => 
        item._id.toString() === (context.data as IListItem).parentList.toString()

    let index = -1
    if((context.params.user as IUser).ownerLists) {
      let ids = (context.params.user as IUser).ownerLists.array ? 
        (context.params.user as IUser).ownerLists.array : 
        [(context.params.user as IUser).ownerLists];
      
      if(ids.findIndex(checker) != -1) return context
    }

    if((context.params.user as IUser).sharedLists) {
      let ids = (context.params.user as IUser).sharedLists.array ? 
        (context.params.user as IUser).sharedLists.array : 
        [(context.params.user as IUser).sharedLists];
      
      if(ids.findIndex(checker) != -1) return context
    }
    throw new Error('No permission for modifying current list!')
  };
};
