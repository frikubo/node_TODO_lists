import * as local from '@feathersjs/authentication-local';
import authenticate from '@feathersjs/authentication/lib/hooks/authenticate';
import { HookContext } from '@feathersjs/feathers';
import { disallow, populate, setField, unless } from 'feathers-hooks-common';
// Don't remove this comment. It's needed to format import lines nicely.

const { hashPassword, protect } = local.hooks;

const protectExternalGet =         
  setField({
    from: 'params.user._id',
    as: 'params.query._id'
  })
/**
 * hooks for users service
 */
export default {
  before: {
    all: [],
    find: [ 
      authenticate('jwt'),
      unless(
        hook => !hook.params.hasOwnProperty('provider') ||
                 hook.params.hasOwnProperty('_populate'),
        protectExternalGet
      )
     ],
    get: [ 
      authenticate('jwt'),
      unless(
        hook => !hook.params.hasOwnProperty('provider') ||
                 hook.params.hasOwnProperty('_populate'),
        protectExternalGet
      )
    ],
    create: [ hashPassword('password') ],
    update: [ disallow('external') ],
    patch: [ 
      authenticate('jwt'), 
      hashPassword('password'),
      setField({
        from: 'params.user._id',
        as: 'id'
      }),
      (hook:HookContext)=> {
        delete (hook.data as any).email
        delete (hook.data as any).ownerLists
        delete (hook.data as any).sharedLists
      }
    ],
    remove: [ disallow('external') ]
  },

  after: {
    all: [ 
      // Make sure this fields cannot be send back
      protect('password', 'createdAt', '__v'),
    ],
    find: [
      populate({ 
        schema: {  
          include: [   
            /**
             * Lists that user owns */      
            {
            service: 'lists',
            nameAs: 'ownersLists',
            parentField: 'ownerLists',
            childField: '_id'
            },
            /**
             * Lists that user is included in but not created them
             */
            {
              service: 'lists',
              nameAs: 'subscribedLists',
              parentField: 'sharedLists',
              childField: '_id'
            }
          ]
        }
      }),
      unless(
        hook => !hook.params.hasOwnProperty('provider') ||
                 hook.params.hasOwnProperty('_populate'),
        protect('ownerLists', 'sharedLists', 'todoItems')
      )
    ],
    get: [ protect('ownerLists', 'sharedLists', 'updatedAt') ], // authentication request call
    create: [ protect('ownerLists', 'sharedLists', 'updatedAt') ] ,
    patch: [ protect('ownerLists', 'sharedLists', 'updatedAt') ]
  }
};
