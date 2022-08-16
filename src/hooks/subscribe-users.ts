// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { IUser } from '../models/users.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**
 * Try to subscribe new users added as additional param 'usersToSubscribe'
 */
export default (_options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    // additional param
    if(context.data.hasOwnProperty("usersToSubscribe") && Array.isArray(context.data.usersToSubscribe)) {
      let usersIds: any[] = []

      await Promise.all(context.data.usersToSubscribe.map(async (user: string) => {
        const params = {
          query: { email: user}
        }

        let userData = await context.app.service('users')._find(params)
        if(userData) {
          usersIds.push(userData[0]._id)
          context.app.service('users')._patch(userData[0]._id,
            {
              $addToSet: { sharedLists: context.id }
            } as Partial<IUser>).catch((err:any) => console.log(err))
        }
      }))
      context.data.$addToSet = { sharedTo: [...usersIds] }
    }
    return context;
  };
};
