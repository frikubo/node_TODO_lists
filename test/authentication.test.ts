import app from '../src/app';

describe('authentication', () => {
  describe('local strategy', () => {
    const userInfo = {
      email: 'frickar@example.com',
      password: 'frickar'
    };

    beforeAll(async () => {
      try {
        await app.service('users').create(userInfo);
      } catch (error) {
        // Do nothing, it just means the user already exists and can be tested
      }
    });

    it('authenticates user and creates accessToken', async () => {
      const { user, accessToken } = await app.service('authentication').create({
        strategy: 'local',
        ...userInfo
      }, {});
      
      expect(accessToken).toBeTruthy();
      expect(user).toBeTruthy();
    });
  });
});
