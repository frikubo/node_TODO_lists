// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { IUser } from '../models/users.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**
 * Unregister all pointers to lists in users documents
 */
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    // extraction of _id param
    const checker = 
      (item: { _id: string; }) => item._id.toString() === context.result._id

    // subscribers
    if(context.result.subscribers) {
      let subs = context.result.subscribers.array ? context.result.subscribers.array :
        [context.result.subscribers];
      // clean subscribed users
      subs.forEach(
        (user : { _id: { toString: () => any; }; }) => {
          (user as unknown as IUser).sharedLists
            .splice((user as unknown as IUser).sharedLists.findIndex(checker), 1);
          context.app.service('users')._patch(user._id, user)
        });
    }

    // owner clean
    (context.params.user as IUser).ownerLists
      .splice((context.params.user as IUser).ownerLists.findIndex(checker), 1);
    context.app.service('users')._patch(context.params.user?._id, context.params.user)

    //TODO clean items
    return context;
  };
};
