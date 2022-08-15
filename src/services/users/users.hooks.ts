import * as local from '@feathersjs/authentication-local';
import authenticate from '@feathersjs/authentication/lib/hooks/authenticate';
import { disallow } from 'feathers-hooks-common';
// Don't remove this comment. It's needed to format import lines nicely.

const { hashPassword, protect } = local.hooks;

export default {
  before: {
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [ hashPassword('password') ],
    update: [ authenticate('jwt'), hashPassword('password')],
    patch: [ authenticate('jwt'), hashPassword('password') ],
    remove: [ disallow() ]
  },

  after: {
    all: [ 
      // Make sure this fields cannot be send back
      protect('password', 'createdAt', 'updatedAt', '__v'),
    ]
  }
};
