import app from '../../src/app';

describe('\'lists\' service', () => {
  it('registered the service', () => {
    const service = app.service('lists');
    expect(service).toBeTruthy();
  });
});
