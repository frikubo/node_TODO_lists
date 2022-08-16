// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { IList } from '../models/lists.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    context.app.service('lists')._patch(context.result.list._id,
      {
        todoItems : !(context.result?.list as IList).todoItems ? 
          [context.result?._id] : [...(context.result?.list as IList).todoItems, context.result?._id]
      } as Partial<IList>
      )
    return context;
  };
};
