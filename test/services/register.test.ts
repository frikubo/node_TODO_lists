import app from '../../src/app';
import { IUser } from '../../src/models/users.model';

const userInfo : IUser = {
  email: 'frickar@example.com',
  password: 'frickar'
};

describe('\'users\' service', () => {
  it('registered the service', () => {
    const service = app.service('users');
    expect(service).toBeTruthy();
  });
});