// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { IUser } from '../models/users.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    if(context.result) {
      /**
       * Register list to user after list is created
       * WITHOUT HOOKS
       */
      await context.app.service('users')._patch(context.params?.user?._id, 
        {
          ownerLists : !(context.params?.user as IUser).ownerLists ? [context.result._id] : [...(context.params?.user as IUser).ownerLists, context.result._id]
        } as Partial<IUser>)
    }
    return context;
  };
};
