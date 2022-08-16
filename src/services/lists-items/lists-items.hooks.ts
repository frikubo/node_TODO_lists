import * as local from '@feathersjs/authentication-local';
import * as authentication from '@feathersjs/authentication';
import { populate, setField, unless } from 'feathers-hooks-common';
import registerItemToList from '../../hooks/register-item-to-list';
import canUserModifyList from '../../hooks/can-user-modify-list';
import { errors } from '@feathersjs/errors';
import { MongooseError } from 'mongoose';
import { Hook, HookContext } from '@feathersjs/feathers';
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
      authenticate('jwt')
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
      canUserModifyList(), 
      registerUserAsCreator,
      // default status init
      (hook:HookContext) => {
        (hook.data as IListItem).state = 'active'
      }
    ],
    update: [],
    patch: [
      canUserModifyList(),
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
