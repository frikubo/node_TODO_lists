import * as local from '@feathersjs/authentication-local';
import * as authentication from '@feathersjs/authentication';
import registerListToUser from '../../hooks/register-list-to-user';
import { disallow, iff, populate, setField, unless } from 'feathers-hooks-common';
import safeListModify from '../../hooks/safe-list-modify';
import cleanAfterListDelete from '../../hooks/clean-after-list-delete';
import subscribeUsers from '../../hooks/subscribe-users';
import { IUser } from '../../models/users.model';
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
    get: [
      iff( hook => hook.params?.headers?.authorization ? true : false,
        authenticate('jwt')
      )
    ],
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
    create: [ 
      authenticate('jwt'), 
      registerUserAsOwner 
    ],
    update: [ disallow('external') ],
    patch: [
      authenticate('jwt'), 
      safeListModify(), 
      subscribeUsers()],
    remove: [ 
      authenticate('jwt'), 
      safeListModify() 
    ]
  },

  after: {
    all: [
      protect('createdAt', '__v'),
    ],
    find: [],
    get: [
      iff( hook => hook.params?.headers?.authorization ? true : false,
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
              }
            ]
          }
        })
      ),
      populate({ 
        schema: {  
          include: [
            {
              service: 'lists-items',
              nameAs: 'items',
              parentField: 'todoItems',
              childField: '_id'
            }
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
      protect('_id', '_include', 'subscribers')
    ]
  }
};
