import * as local from '@feathersjs/authentication-local';
import * as authentication from '@feathersjs/authentication';
import registerListToUser from '../../hooks/register-list-to-user';
import { disallow, populate, setField } from 'feathers-hooks-common';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
const { protect } = local.hooks

const limitToUser = setField({
  from: 'params.user._id',
  as: 'params.query.owner'
});

const registerUserAsOwner = setField({
  from: 'params.user._id',
  as: 'data.owner'
})

export default {
  before: {
    all: [],
    get: [],
    find: [ authenticate('jwt'), limitToUser ],
    create: [ authenticate('jwt'), registerUserAsOwner ],
    update: [ disallow() ],
    patch: [ authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
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
