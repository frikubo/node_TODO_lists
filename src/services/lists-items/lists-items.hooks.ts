import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import { populate, setField } from 'feathers-hooks-common';
import registerItemToList from '../../hooks/register-item-to-list';
import canUserModifyList from '../../hooks/can-user-modify-list';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const registerUserAsCreator = setField({
  from: 'params.user._id',
  as: 'data.user'
})

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt'), canUserModifyList(), registerUserAsCreator],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
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
      registerItemToList()
    ],
    update: [],
    patch: [],
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
