import * as local from '@feathersjs/authentication-local';
import * as authentication from '@feathersjs/authentication';
import registerListToUser from '../../hooks/register-list-to-user';
import { disallow, populate, setField } from 'feathers-hooks-common';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
const { protect } = local.hooks

export default {
  before: {
    all: [ authenticate('jwt'),],
    get: [],
    find: [],
    create: [],
    update: [ disallow() ],
    patch: [],
    remove: []
  },

  after: {
    all: [
      protect('todoItems', 'sharedTo', 'createdAt', '__v'),
    ],
    find: [],
    get: [],
    create: [registerListToUser()],
    update: [ ],
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
