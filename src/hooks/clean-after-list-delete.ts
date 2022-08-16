// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { IList } from '../models/lists.model';
import { IUser } from '../models/users.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**
 * Unregister all pointers to lists in users documents and all items included in list
 */
export default (_options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    // extraction of _id param
    const checker = 
      (item: { _id: string; }) => item._id.toString() === context.result._id

    context.app.service('users')._patch(context.result.owner, {
      $pullAll: { ownerLists: [context.result._id] },
    }).catch((err:any) => console.log(err))

    context.app.service('users')._patch(null, {
      $pullAll: { sharedLists: [context.result._id] } 
    }, { 
      query: { _id : { $in: context.result.sharedTo} }
    }).catch((err:any) => console.log(err))

    context.app.service('lists-items').remove(null, 
      { query: { _id : { $in: (context.result as IList).todoItems }}
    }).catch((err:any) => console.log(err))

    return context;
  };
};
