import app from '../../src/app';

describe('\'listsItems\' service', () => {
  it('registered the service', () => {
    const service = app.service('lists-items');
    expect(service).toBeTruthy();
  });
});
