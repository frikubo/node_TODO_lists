// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { IList } from '../models/lists.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**
 * Register item to parent list
 */
export default (_options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    context.app.service('lists')._patch(context.result.list._id,
      {
        $addToSet: { todoItems: context.result?._id }
      } as Partial<IList>
      ).catch((err:any) => console.log(err))
    return context;
  };
};
