import * as local from '@feathersjs/authentication-local';
import * as authentication from '@feathersjs/authentication';
import { populate, setField, unless } from 'feathers-hooks-common';
import registerItemToList from '../../hooks/register-item-to-list';
import canUserModifyList from '../../hooks/can-user-modify-list-item';
import { HookContext } from '@feathersjs/feathers';
import { IListItem } from '../../models/lists-items.model';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
const { protect } = local.hooks

const registerUserAsCreator = setField({
  from: 'params.user._id',
  as: 'data.user'
})

export default {
  before: {
    all: [
    ],
    find: [
      unless(
        hook => !hook.params.hasOwnProperty('provider') ||
                 hook.params.hasOwnProperty('_populate'),
        () => { throw new Error('No external calls allowed!') }
      )
    ],
    get: [
      unless(
        hook => !hook.params.hasOwnProperty('provider') ||
                 hook.params.hasOwnProperty('_populate'),
        () => { throw new Error('No external calls allowed!') }
      )
    ],
    create: [
      authenticate('jwt'),
      canUserModifyList(), 
      registerUserAsCreator,
      // default status init
      (hook:HookContext) => {
        (hook.data as IListItem).state = 'active'
      }
    ],
    update: [],
    patch: [
      authenticate('jwt'),
      canUserModifyList(),
      unless(
        hook => hook.id ? true : false,
        () => { throw new Error('No external calls allowed!') }
      ),
      (hook:HookContext)=> {
        delete (hook.data as any).user
        delete (hook.data as any).parentList
        console.log(hook.data)
      }
    ],
    remove: [
      unless(
        hook => !hook.params.hasOwnProperty('provider') ||
                 hook.params.hasOwnProperty('_populate'),
        () => { throw new Error('No external calls allowed!') }
      )
    ]
  },

  after: {
    all: [
      protect('__v')
    ],
    find: [],
    get: [],
    create: [
      populate({ 
        schema: {  
          include: {
            service: 'lists',
            nameAs: 'list',
            parentField: 'parentList',
            childField: '_id'
          }
        }
      }),
      registerItemToList(),
      protect('_id', 'list', '_include', 'parentList', 'updatedAt')
    ],
    update: [],
    patch: [ protect('_id', 'list', '_include', 'parentList', 'createdAt') ],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
