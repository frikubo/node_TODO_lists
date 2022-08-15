import app from '../../src/app';

describe('\'authentication\' service', () => {
  it('registered the service', () => {
    const service = app.service('authentication');
    expect(service).toBeTruthy();
  });
});
