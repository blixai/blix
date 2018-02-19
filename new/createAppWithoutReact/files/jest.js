const request = require('supertest');
const app = require('../server/server')


describe('Test the root path', () => {
  test('It should get an html response', (done) => {
    request(app).get('/').then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});