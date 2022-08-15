import { Application } from '../declarations';

import users from './users/users.service';

import authentification from './authentication.service';
import todoLists from './todoLists/todoLists.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(authentification);
  app.configure(users);
  app.configure(todoLists);
}
