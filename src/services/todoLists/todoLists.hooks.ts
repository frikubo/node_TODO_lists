import * as local from '@feathersjs/authentication-local';
import * as authentication from '@feathersjs/authentication';
import registerListToUser from '../../hooks/register-list-to-user';
import { disallow, populate, setField, unless } from 'feathers-hooks-common';
import safeListDelete from '../../hooks/safe-list-delete';
import cleanAfterListDelete from '../../hooks/clean-after-list-delete';
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
    find: [
      authenticate('jwt'),
      // when populating then no limit by user
      unless(
        hook => hook.params.hasOwnProperty('_populate'),
        // if external call then limit data to authenticated user
        limitToUser,
        protect('owner')
      )
    ],
    create: [ authenticate('jwt'), registerUserAsOwner ],
    update: [ disallow('external') ],
    patch: [ disallow('external') ],
    remove: [ authenticate('jwt'), safeListDelete() ]
  },

  after: {
    all: [
      protect('todoItems', 'createdAt', '__v'),
    ],
    find: [],
    get: [
      populate({ 
        schema: {  
          include: [
            {
            service: 'users',
            nameAs: 'owner',
            parentField: 'owner',
            childField: '_id'
            },
            {
              service: 'users',
              nameAs: 'subscribers',
              parentField: 'sharedTo',
              childField: '_id'
            }/*,
            {
            service: 'users',
            nameAs: 'items',
            parentField: 'todoItems',
            childField: '_id'
            }*/
          ]
        }
      }),
    ],
    create: [registerListToUser()],
    update: [ ],
    patch: [],
    remove: [
      populate({ 
        schema: {  
          include: {
            service: 'users',
            nameAs: 'subscribers',
            parentField: 'sharedTo',
            childField: '_id'
          }
        }
      }), 
      cleanAfterListDelete(),
      protect('_id', 'sharedTo', '_include', 'subscribers')
    ]
  }
};
